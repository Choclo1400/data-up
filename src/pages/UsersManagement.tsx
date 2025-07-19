import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const UsersManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administración de usuarios del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página estará disponible una vez que se conecte Supabase para la gestión completa de usuarios.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default UsersManagement