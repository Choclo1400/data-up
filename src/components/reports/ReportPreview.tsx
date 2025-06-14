
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportData, ReportType } from '@/types/reports';

interface ReportPreviewProps {
  reportData: ReportData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportPreview: React.FC<ReportPreviewProps> = ({ reportData }) => {
  const renderChart = () => {
    switch (reportData.type) {
      case ReportType.REQUEST_STATUS:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, porcentaje }) => `${estado} ${porcentaje}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {reportData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case ReportType.TECHNICIAN_PERFORMANCE:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tecnico" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="solicitudesCompletadas" fill="hsl(var(--primary))" name="Solicitudes Completadas" />
              <Bar dataKey="eficiencia" fill="hsl(var(--secondary))" name="Eficiencia %" />
            </BarChart>
          </ResponsiveContainer>
        );

      case ReportType.MONTHLY_TRENDS:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="solicitudes" stroke="hsl(var(--primary))" name="Solicitudes" />
              <Line type="monotone" dataKey="completadas" stroke="hsl(var(--secondary))" name="Completadas" />
            </LineChart>
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
        {[ReportType.REQUEST_STATUS, ReportType.TECHNICIAN_PERFORMANCE, ReportType.MONTHLY_TRENDS].includes(reportData.type) 
          ? renderChart() 
          : renderTable()
        }
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
