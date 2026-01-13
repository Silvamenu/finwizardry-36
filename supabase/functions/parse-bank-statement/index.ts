import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent } = await req.json();
    
    if (!pdfContent) {
      return new Response(
        JSON.stringify({ error: "PDF content is required" }),
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
    const truncatedContent = pdfContent.slice(0, 30000);

    const systemPrompt = `You are a financial document analyzer specialized in parsing bank statements.
Your task is to extract all transactions from the provided bank statement text.

For each transaction, identify:
1. Date (in YYYY-MM-DD format)
2. Description (merchant name or transaction description)
3. Amount (as a positive number)
4. Type ("income" for credits/deposits, "expense" for debits/withdrawals)

Important rules:
- Convert all dates to YYYY-MM-DD format
- Extract the amount as a positive number (without currency symbols)
- Determine if it's income or expense based on context (credits, deposits, salary = income; debits, payments, purchases = expense)
- Include all transactions found, even partial information
- If a date is unclear, use a reasonable estimate based on context
- Clean up descriptions by removing extra spaces and unnecessary characters`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this bank statement and extract all transactions:\n\n${truncatedContent}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_transactions",
              description: "Extract transactions from a bank statement",
              parameters: {
                type: "object",
                properties: {
                  transactions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
                        description: { type: "string", description: "Transaction description" },
                        amount: { type: "number", description: "Transaction amount as positive number" },
                        type: { type: "string", enum: ["income", "expense"], description: "Transaction type" }
                      },
                      required: ["date", "description", "amount", "type"],
                      additionalProperties: false
                    }
                  },
                  summary: {
                    type: "object",
                    properties: {
                      total_income: { type: "number" },
                      total_expenses: { type: "number" },
                      transaction_count: { type: "number" },
                      period: { type: "string" }
                    }
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
    
    // Extract the tool call response
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_transactions") {
      console.error("Unexpected response format:", JSON.stringify(result));
      return new Response(
        JSON.stringify({ error: "Formato de resposta inesperado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    
    // Validate and clean transactions
    const validTransactions: ExtractedTransaction[] = extractedData.transactions
      .filter((t: any) => t.date && t.description && typeof t.amount === "number" && t.amount > 0)
      .map((t: any) => ({
        date: t.date,
        description: t.description.trim().substring(0, 255),
        amount: Math.abs(t.amount),
        type: t.type === "income" ? "income" : "expense"
      }));

    return new Response(
      JSON.stringify({ 
        transactions: validTransactions,
        summary: extractedData.summary || {
          total_income: validTransactions.filter((t: ExtractedTransaction) => t.type === "income").reduce((sum: number, t: ExtractedTransaction) => sum + t.amount, 0),
          total_expenses: validTransactions.filter((t: ExtractedTransaction) => t.type === "expense").reduce((sum: number, t: ExtractedTransaction) => sum + t.amount, 0),
          transaction_count: validTransactions.length
        }
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
