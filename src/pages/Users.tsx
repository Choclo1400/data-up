
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UserForm from '@/components/users/UserForm';
import RoleChangeDialog from '@/components/users/RoleChangeDialog';
import { useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus, useChangeUserRole, User } from '@/hooks/useUsers';
import { UserRole } from '@/types';
import { Users, Plus, Search, Edit, Trash2, UserX, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Datos de muestra con formato correcto
const sampleUsers: User[] = [
  {
    id: 'USER-001',
    _id: 'USER-001',
    name: 'Admin Sistema',
    email: 'admin@inmel.cl',
    role: UserRole.ADMIN,
    isActive: true,
    twoFactorEnabled: false,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15T10:30:00Z',
    permissions: ['create_requests', 'edit_requests', 'delete_requests', 'manage_clients', 'manage_technicians', 'manage_users', 'view_reports', 'system_config'],
    department: 'Sistemas',
  },
  {
    id: 'USER-002',
    _id: 'USER-002',
    name: 'Juan Supervisor',
    email: 'juan.supervisor@inmel.cl',
    role: UserRole.SUPERVISOR,
    isActive: true,
    twoFactorEnabled: false,
    createdAt: '2023-03-15',
    updatedAt: '2024-01-14T16:45:00Z',
    permissions: ['create_requests', 'edit_requests', 'manage_technicians', 'view_reports'],
    department: 'Operaciones',
  }
];

const UsersPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const toggleUserStatus = useToggleUserStatus();
  const changeUserRole = useChangeUserRole();
  
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleChangeDialog, setRoleChangeDialog] = useState<{
    isOpen: boolean;
    user: User | null;
    newRole: UserRole;
  }>({
    isOpen: false,
    user: null,
    newRole: UserRole.OPERATOR
  });

  const loading = createUser.isPending || updateUser.isPending || deleteUser.isPending || 
                  toggleUserStatus.isPending || changeUserRole.isPending;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (data: Partial<User>) => {
    try {
      // Ensure required fields are present
      const createData = {
        name: data.name || '',
        email: data.email || '',
        password: 'temp123456', // Temporary password
        role: data.role || UserRole.OPERATOR,
        department: data.department,
        isActive: data.isActive ?? true,
      };
      
      const newUser = await createUser.mutateAsync(createData);
      const userWithId = { ...newUser, id: newUser._id || `USER-${Date.now()}` };
      setUsers(prev => [...prev, userWithId]);
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (data: Partial<User>) => {
    if (!editingUser) return;
    
    try {
      await updateUser.mutateAsync({ id: editingUser.id, data });
      setUsers(prev => 
        prev.map(user => 
          user.id === editingUser.id ? { ...user, ...data } : user
        )
      );
      setEditingUser(null);
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
      await deleteUser.mutateAsync(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado del sistema.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleUserStatus.mutateAsync(id);
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? { ...user, isActive } : user
        )
      );
      toast({
        title: "Estado actualizado",
        description: `El usuario ha sido ${isActive ? 'activado' : 'desactivado'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del usuario.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive";
      case UserRole.SUPERVISOR:
        return "default";
      case UserRole.MANAGER:
        return "secondary";
      default:
        return "outline";
    }
  };

  const openRoleChangeDialog = (user: User) => {
    setRoleChangeDialog({
      isOpen: true,
      user,
      newRole: user.role
    });
  };

  const closeRoleChangeDialog = () => {
    setRoleChangeDialog({
      isOpen: false,
      user: null,
      newRole: UserRole.OPERATOR
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRoleChangeDialog(prev => ({ ...prev, newRole }));
  };

  const confirmRoleChange = async () => {
    if (!roleChangeDialog.user) return;
    
    const { user, newRole } = roleChangeDialog;
    
    try {
      await changeUserRole.mutateAsync({ id: user.id, role: newRole });
      setUsers(prev => 
        prev.map(u => 
          u.id === user.id ? { ...u, role: newRole } : u
        )
      );
      closeRoleChangeDialog();
      toast({
        title: "Rol actualizado",
        description: `El rol del usuario ${user.name} ha sido cambiado a ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el rol del usuario.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Gestión de Usuarios" 
          subtitle="Administra usuarios y permisos del sistema"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Usuarios</h1>
                <p className="text-muted-foreground">Gestiona usuarios y permisos</p>
              </div>
            </div>
            
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Usuario
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Lista de Usuarios</CardTitle>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
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
                      <TableHead>Rol</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions?.slice(0, 2).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission.split('_')[0]}
                              </Badge>
                            ))}
                            {user.permissions && user.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? (
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
                              onClick={() => openEditForm(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRoleChangeDialog(user)}
                              disabled={user.role === UserRole.ADMIN}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, !user.isActive)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === UserRole.ADMIN}
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

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        initialData={editingUser || undefined}
        loading={loading}
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
      />

      <RoleChangeDialog
        isOpen={roleChangeDialog.isOpen}
        onClose={() => setRoleChangeDialog({
          isOpen: false,
          user: null,
          newRole: UserRole.OPERATOR
        })}
        user={roleChangeDialog.user}
        newRole={roleChangeDialog.newRole}
        onRoleChange={(newRole) => setRoleChangeDialog(prev => ({ ...prev, newRole }))}
        onConfirm={async () => {
          if (!roleChangeDialog.user) return;
          
          const { user, newRole } = roleChangeDialog;
          
          try {
            await changeUserRole.mutateAsync({ id: user.id, role: newRole });
            setUsers(prev => 
              prev.map(u => 
                u.id === user.id ? { ...u, role: newRole } : u
              )
            );
            setRoleChangeDialog({
              isOpen: false,
              user: null,
              newRole: UserRole.OPERATOR
            });
            toast({
              title: "Rol actualizado",
              description: `El rol del usuario ${user.name} ha sido cambiado a ${newRole}.`,
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "No se pudo cambiar el rol del usuario.",
              variant: "destructive",
            });
          }
        }}
        loading={loading}
      />
    </div>
  );
};

export default UsersPage;
