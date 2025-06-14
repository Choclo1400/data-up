
import { useState } from 'react';

export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: string;
  }>;
  data: any[];
}

export interface ImportProgress {
  stage: 'idle' | 'validating' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

export const useDataImport = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [result, setResult] = useState<ImportResult | null>(null);

  const simulateImport = async (file: File): Promise<ImportResult> => {
    setImporting(true);
    setResult(null);
    
    try {
      // Validación inicial
      setProgress({ stage: 'validating', progress: 10, message: 'Validando archivo...' });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Procesamiento
      setProgress({ stage: 'processing', progress: 30, message: 'Procesando datos...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress({ stage: 'processing', progress: 60, message: 'Importando registros...' });
      await new Promise(resolve => setTimeout(resolve, 1200));

      setProgress({ stage: 'processing', progress: 90, message: 'Finalizando importación...' });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Resultados simulados
      const mockResult: ImportResult = {
        total: 150,
        successful: 143,
        failed: 7,
        errors: [
          { row: 12, field: 'email', message: 'Formato de email inválido', value: 'invalid-email' },
          { row: 28, field: 'precio', message: 'Valor numérico requerido', value: 'texto' },
          { row: 45, field: 'categoria', message: 'Categoría no válida', value: 'UNKNOWN' },
          { row: 67, field: 'horas', message: 'Valor debe ser mayor a 0', value: '-5' },
          { row: 89, field: 'nombre', message: 'Campo obligatorio', value: '' },
          { row: 101, field: 'fecha', message: 'Formato de fecha incorrecto', value: '32/13/2024' },
          { row: 134, field: 'telefono', message: 'Formato de teléfono inválido', value: '123' }
        ],
        data: []
      };

      setProgress({ stage: 'completed', progress: 100, message: 'Importación completada' });
      setResult(mockResult);
      return mockResult;

    } catch (error) {
      setProgress({ stage: 'error', progress: 0, message: 'Error durante la importación' });
      throw error;
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setImporting(false);
    setProgress({ stage: 'idle', progress: 0, message: '' });
    setResult(null);
  };

  return {
    importing,
    progress,
    result,
    simulateImport,
    resetImport
  };
};
