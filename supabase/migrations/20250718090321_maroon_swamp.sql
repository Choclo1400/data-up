/*
  # Funciones de autenticación y utilidades

  1. Funciones de utilidad
    - `uid()` - Obtiene el ID del usuario autenticado
    - `get_user_role()` - Obtiene el rol del usuario actual
    - `update_updated_at_column()` - Función para actualizar timestamps

  2. Configuración de autenticación
    - Asegurar que la tabla users esté sincronizada con auth.users
    - Configurar triggers para mantener consistencia
*/

-- Función para obtener el ID del usuario autenticado
CREATE OR REPLACE FUNCTION uid() 
RETURNS uuid 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role() 
RETURNS text 
LANGUAGE sql 
SECURITY DEFINER
AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$;

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para sincronizar usuarios de auth.users con nuestra tabla users
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'operator',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger para crear usuario automáticamente cuando se registra en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Asegurar que RLS esté habilitado en todas las tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir que los usuarios lean su propia información
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para permitir que los usuarios actualicen su propia información
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para administradores y gerentes
DROP POLICY IF EXISTS "Admins and managers can read all users" ON users;
CREATE POLICY "Admins and managers can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (get_user_role() = ANY (ARRAY['admin', 'manager']));

DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');