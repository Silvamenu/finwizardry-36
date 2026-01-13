import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, Check, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { TransactionFormData } from '@/hooks/useTransactions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  selected?: boolean;
}

interface ImportPDFProps {
  onImport: (transactions: TransactionFormData[]) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportPDF({ onImport, open, onOpenChange }: ImportPDFProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'preview'>('upload');
  const [summary, setSummary] = useState<{
    total_income: number;
    total_expenses: number;
    transaction_count: number;
  } | null>(null);

  const readPDFAsText = async (file: File): Promise<string> => {
    // For PDF files, we'll read them as base64 and let the AI extract text
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convert to text - PDFs contain readable text sections
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const char = uint8Array[i];
            // Only include printable ASCII and common extended characters
            if ((char >= 32 && char <= 126) || char === 10 || char === 13) {
              text += String.fromCharCode(char);
            } else if (char >= 128) {
              // Skip non-printable characters but add space to maintain structure
              text += ' ';
            }
          }
          
          // Clean up the extracted text
          text = text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\d.,\-\/R$€£¥:()]/g, ' ')
            .trim();
          
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Por favor, envie um arquivo PDF válido.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('O arquivo é muito grande. O tamanho máximo é 10MB.');
      return;
    }

    setFile(selectedFile);
    setStep('analyzing');
    setAnalyzing(true);

    try {
      const pdfText = await readPDFAsText(selectedFile);
      
      if (pdfText.length < 100) {
        throw new Error('O PDF parece estar vazio ou protegido. Tente um arquivo diferente.');
      }

      const { data, error: fnError } = await supabase.functions.invoke('parse-bank-statement', {
        body: { pdfContent: pdfText }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Erro ao analisar o extrato');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.transactions || data.transactions.length === 0) {
        throw new Error('Nenhuma transação encontrada no extrato. Verifique se o PDF contém dados de transações.');
      }

      const transactionsWithSelection = data.transactions.map((t: ExtractedTransaction) => ({
        ...t,
        selected: true
      }));

      setExtractedTransactions(transactionsWithSelection);
      setSummary(data.summary);
      setStep('preview');
      toast.success(`${data.transactions.length} transações identificadas!`);
    } catch (err: any) {
      console.error('Error analyzing PDF:', err);
      setError(err.message || 'Erro ao processar o arquivo PDF.');
      setStep('upload');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleTransaction = (index: number) => {
    setExtractedTransactions(prev =>
      prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t))
    );
  };

  const toggleAll = (selected: boolean) => {
    setExtractedTransactions(prev => prev.map(t => ({ ...t, selected })));
  };

  const handleImport = async () => {
    const selectedTransactions = extractedTransactions.filter(t => t.selected);

    if (selectedTransactions.length === 0) {
      toast.error('Selecione pelo menos uma transação para importar.');
      return;
    }

    setLoading(true);

    try {
      const formattedTransactions: TransactionFormData[] = selectedTransactions.map(t => ({
        description: t.description,
        amount: t.amount,
        date: t.date,
        type: t.type,
        category_id: null,
        payment_method: null,
        status: 'completed'
      }));

      await onImport(formattedTransactions);
      toast.success(`${selectedTransactions.length} transações importadas com sucesso!`);
      resetState();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error importing transactions:', err);
      setError(err.message || 'Erro ao importar transações.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setExtractedTransactions([]);
    setStep('upload');
    setError(null);
    setSummary(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const selectedCount = extractedTransactions.filter(t => t.selected).length;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetState();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Importar Extrato Bancário com IA
          </DialogTitle>
          <DialogDescription>
            Faça upload do seu extrato bancário em PDF e a IA irá identificar automaticamente suas transações.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'upload' && (
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary/50 transition-colors">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Arraste seu extrato PDF ou clique para selecionar</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Suportamos extratos da maioria dos bancos brasileiros. Tamanho máximo: 10MB.
              </p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                id="pdf-upload"
                onChange={handleFileUpload}
                disabled={analyzing}
              />
              <label htmlFor="pdf-upload">
                <Button asChild variant="default" disabled={analyzing}>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar PDF
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <Sparkles className="h-5 w-5 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Analisando seu extrato...</h3>
              <p className="text-sm text-muted-foreground">
                A IA está identificando suas transações. Isso pode levar alguns segundos.
              </p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Arquivo: <span className="font-medium text-foreground">{file?.name}</span>
                </p>
                <Button variant="ghost" size="sm" onClick={resetState}>
                  Alterar arquivo
                </Button>
              </div>
            </div>

            {summary && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Entradas</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(summary.total_income)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Saídas</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(summary.total_expenses)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Transações</p>
                    <p className="text-lg font-semibold">{summary.transaction_count}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCount === extractedTransactions.length}
                  onCheckedChange={(checked) => toggleAll(checked as boolean)}
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Selecionar todas ({selectedCount}/{extractedTransactions.length})
                </label>
              </div>
            </div>

            <div className="border rounded-lg overflow-auto flex-1 max-h-[300px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedTransactions.map((transaction, index) => (
                    <TableRow
                      key={index}
                      className={!transaction.selected ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={transaction.selected}
                          onCheckedChange={() => toggleTransaction(index)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {(() => {
                          try {
                            return format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR });
                          } catch {
                            return transaction.date;
                          }
                        })()}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                          {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={loading || selectedCount === 0}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Importar {selectedCount} transações
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
