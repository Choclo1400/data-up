
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/common/DateRangePicker';
import { AuditFilters, AuditEventType, AuditSeverity } from '@/types/audit';
import { Filter, X } from 'lucide-react';

interface AuditFiltersProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onClearFilters: () => void;
}

const AuditFiltersComponent: React.FC<AuditFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: from,
      dateTo: to
    });
  };

  const handleEventTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      eventType: value === 'all' ? undefined : value as AuditEventType
    });
  };

  const handleSeverityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      severity: value === 'all' ? undefined : value as AuditSeverity
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value || undefined
    });
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.eventType || 
                          filters.severity || filters.searchTerm;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Búsqueda General</Label>
            <Input
              id="search"
              placeholder="Buscar eventos..."
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <Label>Tipo de Evento</Label>
            <Select value={filters.eventType || 'all'} onValueChange={handleEventTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value={AuditEventType.LOGIN}>Inicios de sesión</SelectItem>
                <SelectItem value={AuditEventType.USER_CREATED}>Usuarios creados</SelectItem>
                <SelectItem value={AuditEventType.USER_UPDATED}>Usuarios actualizados</SelectItem>
                <SelectItem value={AuditEventType.USER_DELETED}>Usuarios eliminados</SelectItem>
                <SelectItem value={AuditEventType.ROLE_CHANGED}>Cambios de rol</SelectItem>
                <SelectItem value={AuditEventType.REQUEST_APPROVED}>Solicitudes aprobadas</SelectItem>
                <SelectItem value={AuditEventType.REQUEST_REJECTED}>Solicitudes rechazadas</SelectItem>
                <SelectItem value={AuditEventType.SYSTEM_ERROR}>Errores del sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Severidad</Label>
            <Select value={filters.severity || 'all'} onValueChange={handleSeverityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las severidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value={AuditSeverity.LOW}>Baja</SelectItem>
                <SelectItem value={AuditSeverity.MEDIUM}>Media</SelectItem>
                <SelectItem value={AuditSeverity.HIGH}>Alta</SelectItem>
                <SelectItem value={AuditSeverity.CRITICAL}>Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <DateRangePicker
              from={filters.dateFrom}
              to={filters.dateTo}
              onDateChange={handleDateChange}
              label="Rango de Fechas"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditFiltersComponent;
