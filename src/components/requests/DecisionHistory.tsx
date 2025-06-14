
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DecisionRecord {
  id: string;
  action: 'approved' | 'rejected';
  performedBy: string;
  performedAt: string;
  role: string;
  comments?: string;
  reason?: string;
}

interface DecisionHistoryProps {
  decisions: DecisionRecord[];
  className?: string;
}

const DecisionHistory: React.FC<DecisionHistoryProps> = ({ decisions, className }) => {
  if (decisions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historial de Decisiones
          </CardTitle>
          <CardDescription>
            No hay decisiones registradas para esta solicitud
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historial de Decisiones
        </CardTitle>
        <CardDescription>
          Registro de todas las aprobaciones y rechazos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="flex items-start gap-3 p-4 rounded-lg border bg-card/50"
            >
              <div className="flex-shrink-0 mt-1">
                {decision.action === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={decision.action === 'approved' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {decision.action === 'approved' ? 'APROBADO' : 'RECHAZADO'}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">
                      por {decision.role}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(decision.performedAt), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{decision.performedBy}</span>
                </div>
                
                {(decision.comments || decision.reason) && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {decision.action === 'approved' ? 'Comentarios:' : 'Motivo del rechazo:'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {decision.comments || decision.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionHistory;
