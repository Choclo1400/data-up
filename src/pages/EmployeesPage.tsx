
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employees';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Plus, Search, Edit, Trash2, UserX, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmployeesPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus, loading } = useEmployees();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los empleados.",
        variant: "destructive",
      });
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEmployee = async (data: Partial<Employee>) => {
    try {
      const newEmployee = await createEmployee(data);
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: "Empleado creado",
        description: "El empleado ha sido creado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el empleado.",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async (data: Partial<Employee>) => {
    if (!editingEmployee) return;
    
    try {
      await updateEmployee(editingEmployee.id, data);
      setEmployees(prev => 
        prev.map(employee => 
          employee.id === editingEmployee.id ? { ...employee, ...data } : employee
        )
      );
      setEditingEmployee(null);
      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado han sido actualizados.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleado.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) return;
    
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(employee => employee.id !== id));
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado del sistema.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleEmployeeStatus(id, isActive);
      setEmployees(prev => 
        prev.map(employee => 
          employee.id === id ? { ...employee, isActive } : employee
        )
      );
      toast({
        title: "Estado actualizado",
        description: `El empleado ha sido ${isActive ? 'activado' : 'desactivado'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del empleado.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  if (!hasPermission('manage_employees')) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Acceso Denegado" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
        <Navbar 
          title="Gestión de Empleados" 
          subtitle="Administra el personal de la empresa"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Empleados</h1>
                <p className="text-muted-foreground">Gestiona la información del personal</p>
              </div>
            </div>
            
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Empleado
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Lista de Empleados</CardTitle>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empleados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>
                          <Badge variant={employee.isActive ? "default" : "secondary"}>
                            {employee.isActive ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Activo</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Inactivo</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(employee)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(employee.id, !employee.isActive)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingEmployee ? handleEditEmployee : handleCreateEmployee}
        initialData={editingEmployee || undefined}
        loading={loading}
        title={editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
      />
    </div>
  );
};

export default EmployeesPage;
