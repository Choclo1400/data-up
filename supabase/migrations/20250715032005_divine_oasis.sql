/*
  # Fix clients table RLS policy to include supervisor role

  1. Security Update
    - Update "Managers and above can manage clients" policy on `clients` table
    - Add 'supervisor' role to the allowed roles array
    - This allows supervisors to create, read, update, and delete client records

  2. Changes Made
    - Modified USING clause to include 'supervisor' role
    - Modified WITH CHECK clause to include 'supervisor' role
    - Policy now allows: admin, manager, and supervisor roles
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Managers and above can manage clients" ON clients;

-- Recreate the policy with supervisor role included
CREATE POLICY "Managers and above can manage clients"
  ON clients
  FOR ALL
  TO public
  USING (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]))
  WITH CHECK (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text, 'supervisor'::text]));