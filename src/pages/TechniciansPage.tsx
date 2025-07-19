import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TechniciansPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Técnicos</h1>
        <p className="text-muted-foreground">
          Gestión de técnicos del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página estará disponible una vez que se conecte Supabase para la gestión completa de técnicos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TechniciansPage