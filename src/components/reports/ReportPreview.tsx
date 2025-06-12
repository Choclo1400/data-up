
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportData, ReportType } from '@/types/reports';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportData }) => {
  const renderChart = () => {
    switch (reportData.type) {
      case ReportType.FORKLIFT_USAGE:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="empilhadeira" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="horasUso" fill="hsl(var(--primary))" name="Horas de Uso" />
              <Bar dataKey="eficiencia" fill="hsl(var(--secondary))" name="Eficiencia %" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case ReportType.FUEL_CONSUMPTION:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="empilhadeira" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumo" fill="hsl(var(--primary))" name="Consumo (L)" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return renderTable();
    }
  };

  const renderTable = () => {
    if (!reportData.data.length) return <p className="text-muted-foreground">No hay datos disponibles</p>;

    const headers = Object.keys(reportData.data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {headers.map((header) => (
                <th key={header} className="text-left p-2 font-medium text-foreground">
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.data.map((row, index) => (
              <tr key={index} className="border-b">
                {headers.map((header) => (
                  <td key={header} className="p-2 text-muted-foreground">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Vista Previa - {reportData.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{reportData.description}</p>
      </CardHeader>
      <CardContent>
        {[ReportType.FORKLIFT_USAGE, ReportType.FUEL_CONSUMPTION].includes(reportData.type) 
          ? renderChart() 
          : renderTable()
        }
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
