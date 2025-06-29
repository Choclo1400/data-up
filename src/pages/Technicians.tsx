import React from 'react'
import { Plus, Edit, Trash2, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { useUsers } from '@/hooks/useSupabaseQuery'
import { LoadingState } from '@/components/ui/loading-state'

export const Technicians: React.FC = () => {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) return <LoadingState />
  if (error) return <div>Error al cargar técnicos</div>

  // Filter only technicians
  const technicians = users?.data?.filter(user => user.role === 'technician') || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Técnicos</h1>
          <p className="text-muted-foreground">
            Gestión de técnicos del sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Técnico
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4" />
                      <span>{technician.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{technician.email}</TableCell>
                  <TableCell>
                    <Badge variant={technician.is_active ? 'default' : 'secondary'}>
                      {technician.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {technician.last_login 
                      ? new Date(technician.last_login).toLocaleDateString()
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}