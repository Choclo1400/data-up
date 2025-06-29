/*
  # Fix RLS Recursion Issues

  1. Security Function
    - Create `get_user_role()` function to safely get user role without RLS recursion
    - Function uses SECURITY DEFINER to bypass RLS when checking user roles

  2. Updated Policies
    - Replace recursive policies on `users` table
    - Update policies on `clients`, `service_requests`, and `audit_logs` tables
    - All policies now use the safe function to avoid infinite recursion

  3. Performance
    - Optimized user role lookups
    - Proper error handling in the function
*/

-- Crear función para obtener el rol del usuario de forma segura
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role text;
BEGIN
  -- Obtener el rol del usuario actual sin activar RLS
  SELECT role INTO user_role
  FROM public.users
  WHERE id = auth.uid();
  
  -- Retornar el rol o null si no se encuentra
  RETURN COALESCE(user_role, '');
EXCEPTION
  WHEN OTHERS THEN
    -- En caso de error, retornar cadena vacía
    RETURN '';
END;
$$;

-- Otorgar permisos de ejecución a los roles necesarios
GRANT EXECUTE ON FUNCTION get_user_role() TO anon;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO public;

-- Eliminar políticas existentes que causan recursión en la tabla users
DROP POLICY IF EXISTS "Admins and managers can read all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Recrear políticas de users usando la nueva función
CREATE POLICY "Admins and managers can read all users"
  ON users
  FOR SELECT
  TO public
  USING (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO public
  USING (get_user_role() = 'admin'::text)
  WITH CHECK (get_user_role() = 'admin'::text);

-- Actualizar políticas de clients
DROP POLICY IF EXISTS "Managers and above can manage clients" ON clients;

CREATE POLICY "Managers and above can manage clients"
  ON clients
  FOR ALL
  TO public
  USING (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]))
  WITH CHECK (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

-- Actualizar políticas de service_requests
DROP POLICY IF EXISTS "Supervisors and above can manage requests" ON service_requests;
DROP POLICY IF EXISTS "Technicians can update assigned requests" ON service_requests;
DROP POLICY IF EXISTS "Users can read assigned requests" ON service_requests;

CREATE POLICY "Supervisors and above can manage requests"
  ON service_requests
  FOR ALL
  TO public
  USING (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]))
  WITH CHECK (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]));

CREATE POLICY "Technicians can update assigned requests"
  ON service_requests
  FOR UPDATE
  TO public
  USING (
    (assigned_technician_id = auth.uid()) OR 
    (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]))
  );

CREATE POLICY "Users can read assigned requests"
  ON service_requests
  FOR SELECT
  TO public
  USING (
    (assigned_technician_id = auth.uid()) OR 
    (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]))
  );

-- Actualizar políticas de audit_logs
DROP POLICY IF EXISTS "Admins can read all audit logs" ON audit_logs;

CREATE POLICY "Admins can read all audit logs"
  ON audit_logs
  FOR SELECT
  TO public
  USING (get_user_role() = 'admin'::text);

-- Comentario final
COMMENT ON FUNCTION get_user_role() IS 'Función SECURITY DEFINER que obtiene el rol del usuario actual sin activar RLS, evitando recursión infinita en las políticas.';