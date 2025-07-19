import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardList, Building2, TrendingUp } from 'lucide-react'
import { useUsers, useClients, useRequests } from '@/hooks/useSupabaseQuery'

const Index: React.FC = () => {
  const { data: users } = useUsers()
  const { data: clients } = useClients()
  const { data: requests } = useRequests()

  const stats = [
    {
      title: 'Total Usuarios',
      value: users?.data?.length || 0,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Clientes',
      value: clients?.data?.length || 0,
      icon: Building2,
      color: 'text-green-600'
    },
    {
      title: 'Solicitudes Activas',
      value: requests?.data?.filter(r => r.status !== 'completed').length || 0,
      icon: ClipboardList,
      color: 'text-orange-600'
    },
    {
      title: 'Solicitudes Completadas',
      value: requests?.data?.filter(r => r.status === 'completed').length || 0,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de gestión de servicios
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests?.data?.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{request.service_type}</p>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{request.status}</p>
                    <p className="text-xs text-muted-foreground">{request.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clients?.data?.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{client.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index