import React from 'react'
import { FileText, Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRequests, useClients, useUsers } from '@/hooks/useSupabaseQuery'

const ReportsPage: React.FC = () => {
  const { data: requests } = useRequests()
  const { data: clients } = useClients()
  const { data: users } = useUsers()

  const generateReport = (type: string) => {
    // Placeholder for report generation
    console.log(`Generating ${type} report`)
  }

  const reportTypes = [
    {
      title: 'Reporte de Solicitudes',
      description: 'Resumen completo de todas las solicitudes de servicio',
      icon: FileText,
      action: () => generateReport('requests')
    },
    {
      title: 'Reporte de Clientes',
      description: 'Lista detallada de todos los clientes registrados',
      icon: FileText,
      action: () => generateReport('clients')
    },
    {
      title: 'Reporte de Técnicos',
      description: 'Estadísticas de rendimiento de técnicos',
      icon: FileText,
      action: () => generateReport('technicians')
    },
    {
      title: 'Reporte Mensual',
      description: 'Resumen mensual de actividades y métricas',
      icon: Calendar,
      action: () => generateReport('monthly')
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">
          Generación y descarga de reportes del sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <report.icon className="h-5 w-5" />
                <span>{report.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {report.description}
              </p>
              <Button onClick={report.action} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {requests?.data?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Solicitudes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {clients?.data?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Clientes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users?.data?.filter(u => u.role === 'technician').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Técnicos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsPage