
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAudit } from '@/hooks/useAudit';
import { AuditEventType, AuditSeverity, AuditFilters } from '@/types/audit';
import { 
  Search, 
  Filter, 
  Calendar, 
  User,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { DateRangePicker } from '@/components/common/DateRangePicker';

const AuditLogViewer: React.FC = () => {
  const { getAuditEvents, loading } = useAudit();
  const [events, setEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    searchTerm: '',
    eventType: undefined,
    severity: undefined,
    dateFrom: undefined,
    dateTo: undefined
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const data = await getAuditEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error loading audit events:', error);
    }
  };

  const getSeverityIcon = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case AuditSeverity.HIGH:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case AuditSeverity.MEDIUM:
        return <Info className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return 'destructive';
      case AuditSeverity.HIGH:
        return 'default';
      case AuditSeverity.MEDIUM:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEventTypeIcon = (type: AuditEventType) => {
    switch (type) {
      case AuditEventType.LOGIN:
      case AuditEventType.LOGOUT:
        return <User className="w-4 h-4" />;
      case AuditEventType.USER_CREATED:
      case AuditEventType.USER_UPDATED:
      case AuditEventType.ROLE_CHANGED:
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      eventType: undefined,
      severity: undefined,
      dateFrom: undefined,
      dateTo: undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Auditoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select 
              value={filters.eventType} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                eventType: value as AuditEventType 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.values(AuditEventType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.severity} 
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                severity: value as AuditSeverity 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                {Object.values(AuditSeverity).map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>

          <div className="mt-4">
            <DateRangePicker
              from={filters.dateFrom}
              to={filters.dateTo}
              onSelect={(range) => setFilters(prev => ({
                ...prev,
                dateFrom: range?.from,
                dateTo: range?.to
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Registro de Auditoría</span>
            <Badge variant="outline">
              {events.length} eventos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando eventos...
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron eventos con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(event.severity)}
                          <Badge variant={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="text-sm">
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.userRole}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.ipAddress && (
                          <p className="text-xs">IP: {event.ipAddress}</p>
                        )}
                        {event.entityId && (
                          <p className="text-xs">
                            {event.entityType}: {event.entityId}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogViewer;
