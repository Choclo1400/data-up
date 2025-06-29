/*
  # Solución para el problema de recursión en RLS

  1. Nueva función
    - `get_user_role()` - Función SECURITY DEFINER para obtener el rol del usuario sin activar RLS
    - Evita la recursión al consultar la tabla users

  2. Permisos
    - Otorga permisos de ejecución a roles anon y authenticated

  3. Políticas actualizadas
    - Reemplaza subconsultas recursivas con llamadas a la función
    - Aplica a tablas: users, clients, service_requests
    - Mantiene la misma lógica de seguridad sin recursión

  4. Notas importantes
    - La función usa SECURITY DEFINER para evitar RLS
    - search_path vacío previene inyección de esquemas
    - Manejo de errores para casos donde el usuario no existe
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

-- Crear índice para mejorar el rendimiento de la función
CREATE INDEX IF NOT EXISTS idx_users_auth_uid ON users(id) WHERE id = auth.uid();

-- Comentario final
COMMENT ON FUNCTION get_user_role() IS 'Función SECURITY DEFINER que obtiene el rol del usuario actual sin activar RLS, evitando recursión infinita en las políticas.';