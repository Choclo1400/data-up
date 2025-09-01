import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RequestForm } from '@/components/features/requests';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ServiceRequests = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitudes de Servicio</h1>
        <p className="text-muted-foreground">
          Gestión de solicitudes de servicio del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página estará disponible una vez que se conecte Supabase para la gestión completa de solicitudes de servicio.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ServiceRequests