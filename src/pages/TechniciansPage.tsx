import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TechnicianForm } from '@/components/features/technicians';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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