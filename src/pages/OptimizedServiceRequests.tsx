import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { OptimizedTable } from '@/components/ui/optimized-table'
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery'
import { OptimizedService } from '@/services/optimizedService'
import { Search, Filter } from 'lucide-react'

export default function OptimizedServiceRequests() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [page, setPage] = useState(0)

  // Query optimizada con cache
  const { data: requests = [], isLoading } = useOptimizedQuery(
    ['service-requests', statusFilter, priorityFilter],
    () => OptimizedService.getServiceRequestsWithDetails({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined
    }),
    { staleTime: 2 * 60 * 1000 } // 2 minutos de cache
  )

  // Filtrado local optimizado
  const filteredRequests = useMemo(() => {
    if (!searchTerm) return requests
    
    return requests.filter(request =>
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [requests, searchTerm])

  // Paginación local
  const pageSize = 20
  const totalPages = Math.ceil(filteredRequests.length / pageSize)
  const paginatedRequests = useMemo(() => {
    const start = page * pageSize
    return filteredRequests.slice(start, start + pageSize)
  }, [filteredRequests, page])

  const columns = [
    {
      key: 'service_type' as const,
      label: 'Tipo de Servicio',
    },
    {
      key: 'clients' as const,
      label: 'Cliente',
      render: (clients: any) => clients?.name || 'Sin asignar'
    },
    {
      key: 'priority' as const,
      label: 'Prioridad',
      render: (priority: string) => (
        <Badge variant={
          priority === 'urgent' ? 'destructive' :
          priority === 'high' ? 'default' :
          priority === 'medium' ? 'secondary' : 'outline'
        }>
          {priority}
        </Badge>
      )
    },
    {
      key: 'status' as const,
      label: 'Estado',
      render: (status: string) => (
        <Badge variant={
          status === 'completed' ? 'default' :
          status === 'in_progress' ? 'secondary' :
          status === 'approved' ? 'outline' : 'destructive'
        }>
          {status}
        </Badge>
      )
    },
    {
      key: 'assigned_technician' as const,
      label: 'Técnico',
      render: (technician: any) => technician?.name || 'Sin asignar'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Solicitudes de Servicio</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las prioridades</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <OptimizedTable
            data={paginatedRequests}
            columns={columns}
            loading={isLoading}
            pagination={{
              page,
              totalPages,
              onPageChange: setPage
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}