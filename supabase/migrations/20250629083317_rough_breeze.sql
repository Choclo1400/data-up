/*
  # Add clients with missing data for testing

  1. New Tables
    - Inserts sample clients with intentionally missing data fields
    - Demonstrates various scenarios of incomplete client information

  2. Data Structure
    - Individual clients with missing contact information
    - Company clients with missing contact persons or addresses
    - Mixed scenarios to test data validation and completion workflows

  3. Missing Data Patterns
    - Email addresses missing for some clients
    - Phone numbers not provided
    - Incomplete addresses
    - Missing contact persons for company clients
*/

-- Insert clients with various missing data scenarios
INSERT INTO clients (id, name, email, phone, address, type, contact_person, is_active, created_at, updated_at) VALUES

-- Individual clients with missing data
('750e8400-e29b-41d4-a716-446655440001', 'María González Ruiz', NULL, '+34 666 123 456', 'Calle Alcalá 123, 28009 Madrid', 'individual', 'María González Ruiz', true, '2024-01-15 10:30:00+00', '2024-01-15 10:30:00+00'),

('750e8400-e29b-41d4-a716-446655440002', 'José Antonio Martín', 'ja.martin@gmail.com', NULL, 'Avenida Diagonal 456, 08013 Barcelona', 'individual', 'José Antonio Martín', true, '2024-02-20 14:15:00+00', '2024-02-20 14:15:00+00'),

('750e8400-e29b-41d4-a716-446655440003', 'Carmen López Vega', 'carmen.lopez@hotmail.com', '+34 654 789 123', NULL, 'individual', 'Carmen López Vega', true, '2024-03-10 09:45:00+00', '2024-03-10 09:45:00+00'),

('750e8400-e29b-41d4-a716-446655440004', 'Francisco Jiménez', NULL, NULL, 'Plaza Mayor 8, 37001 Salamanca', 'individual', 'Francisco Jiménez', true, '2024-04-05 16:20:00+00', '2024-04-05 16:20:00+00'),

-- Company clients with missing contact person
('750e8400-e29b-41d4-a716-446655440005', 'Construcciones del Norte S.A.', 'info@construccionesnorte.com', '+34 985 234 567', 'Polígono Industrial Asipo, Nave 45, 33428 Llanera, Asturias', 'company', NULL, true, '2024-01-25 11:00:00+00', '2024-01-25 11:00:00+00'),

('750e8400-e29b-41d4-a716-446655440006', 'Talleres Mecánicos Levante', 'contacto@tallereslevante.es', '+34 963 456 789', 'Carrer de la Indústria 78, 46940 Manises, Valencia', 'company', NULL, true, '2024-02-14 13:30:00+00', '2024-02-14 13:30:00+00'),

-- Company clients with missing email
('750e8400-e29b-41d4-a716-446655440007', 'Panadería Artesanal El Trigo', NULL, '+34 954 567 890', 'Calle Sierpes 34, 41004 Sevilla', 'company', 'Antonio Morales', true, '2024-03-08 08:15:00+00', '2024-03-08 08:15:00+00'),

('750e8400-e29b-41d4-a716-446655440008', 'Ferretería Los Hermanos', NULL, '+34 987 654 321', 'Avenida de la Constitución 67, 24001 León', 'company', 'Pedro y Juan Fernández', true, '2024-03-22 15:45:00+00', '2024-03-22 15:45:00+00'),

-- Company clients with missing phone
('750e8400-e29b-41d4-a716-446655440009', 'Consultoría Fiscal Andaluza', 'admin@fiscalandaluza.com', NULL, 'Paseo de Gracia 89, 18009 Granada', 'company', 'Dra. Isabel Ruiz', true, '2024-04-12 10:20:00+00', '2024-04-12 10:20:00+00'),

('750e8400-e29b-41d4-a716-446655440010', 'Transportes Rápidos Galicia', 'operaciones@rapidosgalicia.es', NULL, 'Rúa Real 123, 15701 Santiago de Compostela', 'company', 'Manuel Castro', true, '2024-04-18 12:40:00+00', '2024-04-18 12:40:00+00'),

-- Company clients with missing address
('750e8400-e29b-41d4-a716-446655440011', 'Servicios Informáticos Canarias', 'soporte@infocanarias.com', '+34 928 345 678', NULL, 'company', 'Laura Santana', true, '2024-05-03 09:10:00+00', '2024-05-03 09:10:00+00'),

('750e8400-e29b-41d4-a716-446655440012', 'Clínica Veterinaria San Francisco', 'recepcion@vetsanfrancisco.com', '+34 942 123 456', NULL, 'company', 'Dr. Carlos Mendoza', true, '2024-05-15 14:25:00+00', '2024-05-15 14:25:00+00'),

-- Clients with multiple missing fields (high priority cases)
('750e8400-e29b-41d4-a716-446655440013', 'Roberto Sánchez Torres', NULL, NULL, 'Calle Mayor 45, 09001 Burgos', 'individual', 'Roberto Sánchez Torres', true, '2024-06-01 11:30:00+00', '2024-06-01 11:30:00+00'),

('750e8400-e29b-41d4-a716-446655440014', 'Almacenes Distribución Centro', NULL, NULL, 'Polígono Industrial Santa Ana, Parcela 12, 45200 Illescas, Toledo', 'company', NULL, true, '2024-06-10 16:50:00+00', '2024-06-10 16:50:00+00'),

('750e8400-e29b-41d4-a716-446655440015', 'Ana Belén Moreno', 'anabelen.moreno@yahoo.es', NULL, NULL, 'individual', 'Ana Belén Moreno', true, '2024-06-20 13:15:00+00', '2024-06-20 13:15:00+00'),

-- Critical case: Company with most missing data
('750e8400-e29b-41d4-a716-446655440016', 'Empresa Servicios Múltiples', NULL, NULL, NULL, 'company', NULL, true, '2024-07-01 08:00:00+00', '2024-07-01 08:00:00+00'),

-- Recently added clients with missing data (recent dates)
('750e8400-e29b-41d4-a716-446655440017', 'Peluquería Estilo Moderno', 'citas@estilomoderno.com', NULL, 'Calle Comercio 23, 06001 Badajoz', 'company', NULL, true, '2024-12-15 10:45:00+00', '2024-12-15 10:45:00+00'),

('750e8400-e29b-41d4-a716-446655440018', 'Miguel Ángel Herrera', NULL, '+34 679 234 567', NULL, 'individual', 'Miguel Ángel Herrera', true, '2024-12-20 15:30:00+00', '2024-12-20 15:30:00+00'),

('750e8400-e29b-41d4-a716-446655440019', 'Autoescuela Conducir Seguro', NULL, NULL, 'Avenida de América 156, 47014 Valladolid', 'company', 'Instructor Jefe', true, '2024-12-25 09:20:00+00', '2024-12-25 09:20:00+00'),

('750e8400-e29b-41d4-a716-446655440020', 'Librería Papelería El Saber', 'ventas@elsaber.com', '+34 974 567 123', NULL, 'company', NULL, true, '2024-12-28 12:10:00+00', '2024-12-28 12:10:00+00');