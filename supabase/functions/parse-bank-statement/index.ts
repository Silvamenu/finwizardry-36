import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

// Extract text from PDF binary using multiple methods
function extractTextFromPDFBinary(pdfBytes: Uint8Array): string {
  const textParts: string[] = [];
  const pdfString = new TextDecoder("latin1").decode(pdfBytes);
  
  // Method 1: Extract text from stream objects (handles most bank statements)
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamContent = match[1];
    
    // Try to extract readable text from stream
    // Look for text showing operators: Tj, TJ, ', "
    const textOperatorRegex = /\(([^)]*)\)\s*Tj|\[([^\]]*)\]\s*TJ/g;
    let textMatch;
    
    while ((textMatch = textOperatorRegex.exec(streamContent)) !== null) {
      const text = textMatch[1] || textMatch[2];
      if (text) {
        // Clean and decode the text
        const cleanedText = text
          .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/[\x00-\x1F]/g, ' ');
        
        if (cleanedText.trim().length > 0) {
          textParts.push(cleanedText);
        }
      }
    }
    
    // Also extract plain readable text from streams
    const readableChars = streamContent
      .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (readableChars.length > 20) {
      // Filter out binary garbage by checking for common patterns
      const hasNumbers = /\d/.test(readableChars);
      const hasLetters = /[a-zA-Z]/.test(readableChars);
      const hasDatePattern = /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(readableChars);
      const hasCurrencyPattern = /R\$|BRL|\d+[,\.]\d{2}/.test(readableChars);
      
      if ((hasNumbers && hasLetters) || hasDatePattern || hasCurrencyPattern) {
        textParts.push(readableChars);
      }
    }
  }
  
  // Method 2: Extract text objects directly
  const textObjectRegex = /BT\s*([\s\S]*?)\s*ET/g;
  while ((match = textObjectRegex.exec(pdfString)) !== null) {
    const textBlock = match[1];
    const textContentRegex = /\(([^)]+)\)/g;
    let contentMatch;
    
    while ((contentMatch = textContentRegex.exec(textBlock)) !== null) {
      const text = contentMatch[1]
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
        .replace(/[\x00-\x1F]/g, ' ')
        .trim();
      
      if (text.length > 0) {
        textParts.push(text);
      }
    }
  }
  
  // Method 3: Look for specific bank statement patterns in raw content
  const bankPatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+([A-Za-z\s\*]+)\s+([\d\.,]+)/g,
    /([A-Z][A-Za-z\s\*]+)\s+R?\$?\s*([\d\.,]+)/g,
    /(PIX|TED|DOC|TRANSF|PAGTO|COMPRA|SAQUE|DEPOSITO)[^\n]*/gi
  ];
  
  for (const pattern of bankPatterns) {
    while ((match = pattern.exec(pdfString)) !== null) {
      textParts.push(match[0]);
    }
  }
  
  // Combine and clean all extracted text
  const combinedText = textParts.join(' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\d.,\-\/R$€£¥:()@]/g, ' ')
    .trim();
  
  return combinedText;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, pdfContent, fileName } = await req.json();
    
    let extractedText = "";
    
    if (pdfBase64) {
      // Decode base64 to binary
      const pdfBytes = base64Decode(pdfBase64);
      console.log(`Processing PDF: ${fileName}, size: ${pdfBytes.length} bytes`);
      
      // Extract text from PDF binary
      extractedText = extractTextFromPDFBinary(pdfBytes);
      console.log(`Extracted ${extractedText.length} characters from PDF`);
    } else if (pdfContent) {
      // Fallback to legacy text content
      extractedText = pdfContent;
    } else {
      return new Response(
        JSON.stringify({ error: "PDF content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (extractedText.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: "Não foi possível extrair texto suficiente do PDF. O arquivo pode estar protegido, ser uma imagem escaneada, ou estar em formato incompatível.",
          rawText: extractedText
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit content size to avoid token limits
    const truncatedContent = extractedText.slice(0, 50000);

    const systemPrompt = `You are a financial document analyzer specialized in parsing Brazilian bank statements.
Your task is to extract ALL transactions EXACTLY as they appear in the document. Do NOT invent, estimate, or modify any data.

CRITICAL RULES FOR DATA INTEGRITY:
1. Extract ONLY transactions that are explicitly present in the text
2. Use the EXACT amounts shown - do not round, estimate, or modify values
3. Use the EXACT dates shown - convert to YYYY-MM-DD format but do not guess dates
4. Use the EXACT descriptions - preserve merchant names, PIX keys, transfer details
5. If any data is unclear or partially visible, mark description with [VERIFICAR]
6. Do NOT create transactions that aren't in the document
7. If you cannot determine income vs expense from context, default to "expense"

For each transaction, extract:
1. Date: The exact date in YYYY-MM-DD format (convert from DD/MM/YYYY if needed)
2. Description: The exact merchant name or transaction description as shown
3. Amount: The exact numeric value (as positive number, without R$ symbol)
4. Type: "income" for deposits/credits/transfers IN, "expense" for withdrawals/payments/transfers OUT

Common Brazilian bank patterns:
- PIX RECEBIDO = income
- PIX ENVIADO = expense  
- TRANSF RECEBIDA = income
- TRANSF ENVIADA = expense
- DEPOSITO = income
- SAQUE = expense
- PAGTO/PAGAMENTO = expense
- COMPRA = expense
- ESTORNO = income (refund)
- CREDITO = income
- DEBITO = expense`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract ALL transactions from this bank statement. Return ONLY transactions that are explicitly shown in the text. Do not invent data.\n\nBank Statement Text:\n${truncatedContent}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_transactions",
              description: "Extract transactions exactly as they appear in the bank statement",
              parameters: {
                type: "object",
                properties: {
                  transactions: {
                    type: "array",
                    description: "List of transactions extracted exactly from the document",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
                        description: { type: "string", description: "Exact transaction description from document" },
                        amount: { type: "number", description: "Exact transaction amount as shown" },
                        type: { type: "string", enum: ["income", "expense"], description: "Transaction type" }
                      },
                      required: ["date", "description", "amount", "type"],
                      additionalProperties: false
                    }
                  },
                  extraction_notes: {
                    type: "string",
                    description: "Notes about extraction quality or issues found"
                  }
                },
                required: ["transactions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_transactions" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Configurações > Workspace > Uso." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar o documento" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_transactions") {
      console.error("Unexpected response format:", JSON.stringify(result));
      return new Response(
        JSON.stringify({ error: "Formato de resposta inesperado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    
    // Validate transactions - only filter out completely invalid ones
    const validTransactions: ExtractedTransaction[] = extractedData.transactions
      .filter((t: any) => {
        // Must have date, description, and valid amount
        const hasDate = t.date && /^\d{4}-\d{2}-\d{2}$/.test(t.date);
        const hasDescription = t.description && t.description.trim().length > 0;
        const hasAmount = typeof t.amount === "number" && t.amount > 0;
        return hasDate && hasDescription && hasAmount;
      })
      .map((t: any) => ({
        date: t.date,
        description: t.description.trim(),
        amount: t.amount,
        type: t.type === "income" ? "income" : "expense"
      }));

    console.log(`Extracted ${validTransactions.length} valid transactions`);

    return new Response(
      JSON.stringify({ 
        transactions: validTransactions,
        rawText: truncatedContent.slice(0, 500) + "...",
        summary: {
          total_income: validTransactions.filter((t: ExtractedTransaction) => t.type === "income").reduce((sum: number, t: ExtractedTransaction) => sum + t.amount, 0),
          total_expenses: validTransactions.filter((t: ExtractedTransaction) => t.type === "expense").reduce((sum: number, t: ExtractedTransaction) => sum + t.amount, 0),
          transaction_count: validTransactions.length
        },
        extraction_notes: extractedData.extraction_notes || null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing bank statement:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar o extrato" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
