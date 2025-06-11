
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientType } from '@/types/requests';
import { Filter, X } from 'lucide-react';

interface ClientFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: {
    type?: ClientType;
    region?: string;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const regiones = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá", 
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana",
  "Región del Libertador",
  "Región del Maule",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén",
  "Región de Magallanes"
];

const ClientFilters: React.FC<ClientFiltersProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={onToggle} className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
            {activeFiltersCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Limpiar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="typeFilter">Tipo de Cliente</Label>
            <Select 
              value={filters.type || ''} 
              onValueChange={(value) => updateFilter('type', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {Object.values(ClientType).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="regionFilter">Región</Label>
            <Select 
              value={filters.region || ''} 
              onValueChange={(value) => updateFilter('region', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {regiones.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="statusFilter">Estado</Label>
            <Select 
              value={filters.isActive?.toString() || ''} 
              onValueChange={(value) => updateFilter('isActive', value ? value === 'true' : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateFrom">Fecha Desde</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientFilters;
