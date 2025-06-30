/*
  # Insertar datos de ejemplo para el sistema de gestión de servicios

  1. Datos de ejemplo
    - Usuarios del sistema (administradores, gerentes, supervisores, técnicos, operadores)
    - Clientes (individuales y empresas)
    - Solicitudes de servicio con diferentes estados
    - Notificaciones del sistema
    - Registros de auditoría

  2. Características
    - Datos realistas con fechas recientes
    - Diferentes tipos de servicios y prioridades
    - Estados variados de solicitudes
    - Relaciones correctas entre entidades
    - Prevención de duplicados con ON CONFLICT

  3. Seguridad
    - Usa ON CONFLICT DO NOTHING para evitar errores de duplicados
    - Mantiene integridad referencial
    - Actualiza secuencias para evitar conflictos futuros
*/

-- Insert sample users (system personnel) - usando ON CONFLICT para evitar duplicados
INSERT INTO users (id, email, password_hash, name, role, is_active, two_factor_enabled, last_login, created_at, updated_at) VALUES
-- Admin
('550e8400-e29b-41d4-a716-446655440001', 'admin@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Carlos Mendoza', 'admin', true, true, '2024-12-29 08:30:00+00', '2024-01-15 09:00:00+00', '2024-12-29 08:30:00+00'),

-- Managers
('550e8400-e29b-41d4-a716-446655440002', 'maria.rodriguez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'María Rodríguez', 'manager', true, true, '2024-12-29 07:45:00+00', '2024-02-01 10:30:00+00', '2024-12-29 07:45:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'luis.garcia@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Luis García', 'manager', true, false, '2024-12-28 16:20:00+00', '2024-02-15 11:15:00+00', '2024-12-28 16:20:00+00'),

-- Supervisors
('550e8400-e29b-41d4-a716-446655440004', 'ana.martinez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Ana Martínez', 'supervisor', true, true, '2024-12-29 08:00:00+00', '2024-03-01 09:45:00+00', '2024-12-29 08:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'pedro.sanchez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Pedro Sánchez', 'supervisor', true, false, '2024-12-28 17:30:00+00', '2024-03-10 14:20:00+00', '2024-12-28 17:30:00+00'),

-- Technicians
('550e8400-e29b-41d4-a716-446655440006', 'roberto.lopez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Roberto López', 'technician', true, false, '2024-12-29 08:15:00+00', '2024-04-01 08:30:00+00', '2024-12-29 08:15:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'sofia.hernandez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Sofía Hernández', 'technician', true, false, '2024-12-29 07:30:00+00', '2024-04-05 09:00:00+00', '2024-12-29 07:30:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'diego.morales@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Diego Morales', 'technician', true, false, '2024-12-28 15:45:00+00', '2024-04-10 10:15:00+00', '2024-12-28 15:45:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'carmen.ruiz@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Carmen Ruiz', 'technician', true, false, '2024-12-29 09:00:00+00', '2024-04-15 11:30:00+00', '2024-12-29 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'javier.torres@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Javier Torres', 'technician', true, false, '2024-12-28 14:20:00+00', '2024-04-20 13:45:00+00', '2024-12-28 14:20:00+00'),
('550e8400-e29b-41d4-a716-446655440011', 'elena.vargas@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Elena Vargas', 'technician', true, false, '2024-12-29 08:45:00+00', '2024-04-25 15:00:00+00', '2024-12-29 08:45:00+00'),

-- Operators
('550e8400-e29b-41d4-a716-446655440012', 'miguel.castro@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Miguel Castro', 'operator', true, false, '2024-12-29 07:00:00+00', '2024-05-01 08:00:00+00', '2024-12-29 07:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'laura.jimenez@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Laura Jiménez', 'operator', true, false, '2024-12-28 16:45:00+00', '2024-05-05 09:30:00+00', '2024-12-28 16:45:00+00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, address, type, contact_person, is_active, created_at, updated_at) VALUES
-- Individual clients
('650e8400-e29b-41d4-a716-446655440001', 'Juan Carlos Pérez', 'jc.perez@email.com', '+34 612 345 678', 'Calle Mayor 15, 28001 Madrid', 'individual', 'Juan Carlos Pérez', true, '2024-01-20 10:00:00+00', '2024-01-20 10:00:00+00'),
('650e8400-e29b-41d4-a716-446655440002', 'Isabel Fernández', 'isabel.fernandez@gmail.com', '+34 687 234 567', 'Avenida de la Paz 42, 08002 Barcelona', 'individual', 'Isabel Fernández', true, '2024-02-10 14:30:00+00', '2024-02-10 14:30:00+00'),
('650e8400-e29b-41d4-a716-446655440003', 'Antonio Ruiz', 'antonio.ruiz@hotmail.com', '+34 654 876 543', 'Plaza España 8, 41001 Sevilla', 'individual', 'Antonio Ruiz', true, '2024-03-05 11:15:00+00', '2024-03-05 11:15:00+00'),

-- Company clients
('650e8400-e29b-41d4-a716-446655440004', 'Tecnologías Avanzadas S.L.', 'contacto@tecavanzadas.com', '+34 915 123 456', 'Polígono Industrial Norte, Nave 12, 28050 Madrid', 'company', 'Fernando Gómez', true, '2024-01-25 09:45:00+00', '2024-01-25 09:45:00+00'),
('650e8400-e29b-41d4-a716-446655440005', 'Manufacturas Industriales BCN', 'info@manufacbcn.es', '+34 934 567 890', 'Carrer de la Indústria 25, 08025 Barcelona', 'company', 'Marta Soler', true, '2024-02-15 16:20:00+00', '2024-02-15 16:20:00+00'),
('650e8400-e29b-41d4-a716-446655440006', 'Sistemas Informáticos del Sur', 'admin@sisur.com', '+34 954 321 098', 'Calle Tecnología 33, 41020 Sevilla', 'company', 'Rafael Moreno', true, '2024-03-01 12:30:00+00', '2024-03-01 12:30:00+00'),
('650e8400-e29b-41d4-a716-446655440007', 'Consultoría Empresarial Valencia', 'contacto@ceval.es', '+34 963 789 012', 'Avenida del Puerto 18, 46021 Valencia', 'company', 'Cristina López', true, '2024-03-10 08:45:00+00', '2024-03-10 08:45:00+00'),
('650e8400-e29b-41d4-a716-446655440008', 'Hostelería Premium Madrid', 'gerencia@hostpremium.com', '+34 917 654 321', 'Gran Vía 45, 28013 Madrid', 'company', 'Alberto Vega', true, '2024-03-20 15:10:00+00', '2024-03-20 15:10:00+00'),
('650e8400-e29b-41d4-a716-446655440009', 'Clínica Dental Sonrisa', 'recepcion@clinicasonrisa.com', '+34 976 543 210', 'Paseo de la Constitución 12, 50001 Zaragoza', 'company', 'Dra. Patricia Ruiz', true, '2024-04-01 10:20:00+00', '2024-04-01 10:20:00+00'),
('650e8400-e29b-41d4-a716-446655440010', 'Transportes Logísticos Galicia', 'operaciones@translogal.com', '+34 981 876 543', 'Polígono de Sabón, Parcela 15, 15142 A Coruña', 'company', 'Manuel Fernández', true, '2024-04-10 13:50:00+00', '2024-04-10 13:50:00+00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample service requests
INSERT INTO service_requests (id, client_id, service_type, description, priority, status, assigned_technician_id, approved_by_id, scheduled_date, completed_date, estimated_cost, actual_cost, materials, notes, attachments, created_at, updated_at) VALUES

-- Completed requests
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 'network_maintenance', 'Configuración de nueva red empresarial con 50 equipos. Instalación de switches, configuración de VLAN y políticas de seguridad.', 'high', 'completed', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '2024-12-20 09:00:00+00', '2024-12-22 17:30:00+00', 2500.00, 2350.00, '[{"item": "Switch Cisco 24 puertos", "quantity": 2, "cost": 800.00}, {"item": "Cable UTP Cat6", "quantity": 100, "unit": "metros", "cost": 150.00}, {"item": "Patch panels", "quantity": 4, "cost": 200.00}]', 'Instalación completada exitosamente. Cliente muy satisfecho con el rendimiento de la red.', '[]', '2024-12-15 10:30:00+00', '2024-12-22 17:30:00+00'),

('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'hardware_repair', 'Reparación de ordenador portátil HP. Problema con pantalla que parpadea y se apaga aleatoriamente.', 'medium', 'completed', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', '2024-12-18 14:00:00+00', '2024-12-19 16:45:00+00', 180.00, 165.00, '[{"item": "Cable flex pantalla", "quantity": 1, "cost": 45.00}, {"item": "Mano de obra", "quantity": 2, "unit": "horas", "cost": 120.00}]', 'Problema resuelto. Era el cable flex de la pantalla que estaba dañado.', '[]', '2024-12-16 11:20:00+00', '2024-12-19 16:45:00+00'),

('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440005', 'software_installation', 'Instalación y configuración de sistema ERP para gestión de producción. Migración de datos desde sistema anterior.', 'high', 'completed', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '2024-12-10 08:00:00+00', '2024-12-14 18:00:00+00', 3200.00, 3450.00, '[{"item": "Licencias ERP", "quantity": 15, "cost": 2250.00}, {"item": "Servidor dedicado", "quantity": 1, "cost": 800.00}, {"item": "Configuración y migración", "quantity": 40, "unit": "horas", "cost": 400.00}]', 'Migración exitosa. Formación del personal completada. Sistema funcionando correctamente.', '[]', '2024-12-05 09:15:00+00', '2024-12-14 18:00:00+00'),

-- In progress requests
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440006', 'security_audit', 'Auditoría completa de seguridad informática. Análisis de vulnerabilidades, test de penetración y recomendaciones.', 'high', 'in_progress', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '2024-12-28 09:00:00+00', null, 1800.00, null, '[{"item": "Herramientas de auditoría", "quantity": 1, "cost": 300.00}, {"item": "Análisis especializado", "quantity": 24, "unit": "horas", "cost": 1500.00}]', 'Auditoría en progreso. Se han detectado algunas vulnerabilidades menores que se están documentando.', '[]', '2024-12-23 14:30:00+00', '2024-12-28 15:20:00+00'),

('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440008', 'equipment_maintenance', 'Mantenimiento preventivo de equipos de cocina industrial. Revisión de sistemas de refrigeración y hornos.', 'medium', 'in_progress', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', '2024-12-29 10:00:00+00', null, 650.00, null, '[{"item": "Filtros de aire", "quantity": 6, "cost": 120.00}, {"item": "Lubricantes especiales", "quantity": 3, "cost": 80.00}, {"item": "Repuestos varios", "quantity": 1, "cost": 150.00}]', 'Mantenimiento iniciado. Equipos de refrigeración revisados, pendiente hornos.', '[]', '2024-12-26 16:45:00+00', '2024-12-29 11:30:00+00'),

-- Approved requests (pending start)
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440007', 'data_recovery', 'Recuperación de datos de servidor que sufrió fallo de disco duro. Datos críticos de contabilidad y clientes.', 'urgent', 'approved', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '2024-12-30 08:00:00+00', null, 1200.00, null, '[{"item": "Disco duro de reemplazo", "quantity": 1, "cost": 250.00}, {"item": "Software de recuperación", "quantity": 1, "cost": 400.00}, {"item": "Servicio especializado", "quantity": 12, "unit": "horas", "cost": 550.00}]', 'Solicitud aprobada con máxima prioridad. Cliente necesita datos urgentemente.', '[]', '2024-12-28 20:15:00+00', '2024-12-29 08:30:00+00'),

('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440009', 'network_installation', 'Instalación de red WiFi en clínica dental. Cobertura completa en 4 consultorios y recepción.', 'medium', 'approved', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '2025-01-02 09:00:00+00', null, 850.00, null, '[{"item": "Access Points WiFi 6", "quantity": 3, "cost": 450.00}, {"item": "Switch PoE", "quantity": 1, "cost": 200.00}, {"item": "Cableado estructurado", "quantity": 1, "cost": 200.00}]', 'Instalación programada para después de las fiestas navideñas.', '[]', '2024-12-27 12:00:00+00', '2024-12-28 09:45:00+00'),

-- Pending requests (awaiting approval)
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440010', 'system_upgrade', 'Actualización completa del sistema de gestión logística. Migración a nueva versión con módulos adicionales.', 'high', 'pending', null, null, null, null, 4500.00, null, '[{"item": "Licencias nuevas", "quantity": 25, "cost": 3000.00}, {"item": "Migración de datos", "quantity": 60, "unit": "horas", "cost": 1200.00}, {"item": "Formación usuarios", "quantity": 16, "unit": "horas", "cost": 300.00}]', 'Solicitud pendiente de aprobación por el alto coste. Cliente requiere cotización detallada.', '[]', '2024-12-28 11:30:00+00', '2024-12-28 11:30:00+00'),

('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'virus_removal', 'Eliminación de malware y limpieza completa del sistema. Ordenador muy lento y con comportamiento extraño.', 'medium', 'pending', null, null, null, null, 120.00, null, '[{"item": "Software antivirus premium", "quantity": 1, "cost": 60.00}, {"item": "Limpieza y optimización", "quantity": 2, "unit": "horas", "cost": 60.00}]', 'Cliente reporta ventanas emergentes y lentitud extrema.', '[]', '2024-12-29 09:45:00+00', '2024-12-29 09:45:00+00'),

('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440003', 'printer_repair', 'Reparación de impresora láser que no imprime correctamente. Líneas borrosas y manchas en el papel.', 'low', 'pending', null, null, null, null, 95.00, null, '[{"item": "Tóner de reemplazo", "quantity": 1, "cost": 45.00}, {"item": "Kit de limpieza", "quantity": 1, "cost": 25.00}, {"item": "Diagnóstico y reparación", "quantity": 1, "cost": 25.00}]', 'Problema típico de impresora láser. Posible tóner agotado o tambor sucio.', '[]', '2024-12-29 15:20:00+00', '2024-12-29 15:20:00+00'),

-- Cancelled request
('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440001', 'backup_setup', 'Configuración de sistema de copias de seguridad automáticas en la nube.', 'low', 'cancelled', null, null, null, null, 200.00, null, '[]', 'Cliente decidió posponer el servicio por motivos presupuestarios.', '[]', '2024-12-25 10:00:00+00', '2024-12-26 14:30:00+00'),

-- Emergency request
('750e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440004', 'emergency_support', 'Caída completa del servidor principal. Empresa sin acceso a sistemas críticos de producción.', 'urgent', 'in_progress', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '2024-12-29 14:00:00+00', null, 800.00, null, '[{"item": "Servicio de emergencia", "quantity": 8, "unit": "horas", "cost": 800.00}]', 'Emergencia crítica. Técnico desplazado inmediatamente. Servidor con fallo de fuente de alimentación.', '[]', '2024-12-29 13:45:00+00', '2024-12-29 14:15:00+00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES
-- Notifications for technicians
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Nueva solicitud asignada', 'Se te ha asignado la solicitud #750e8400-e29b-41d4-a716-446655440007 - Instalación de red WiFi en clínica dental', 'info', false, '2024-12-28 09:45:00+00'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'Solicitud de emergencia', 'URGENTE: Se te ha asignado una solicitud de emergencia - Caída del servidor principal', 'error', true, '2024-12-29 14:15:00+00'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 'Recordatorio de cita', 'Recordatorio: Auditoría de seguridad programada para mañana a las 09:00', 'warning', false, '2024-12-27 18:00:00+00'),

-- Notifications for managers
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Solicitud pendiente de aprobación', 'Nueva solicitud de alto coste requiere tu aprobación: Sistema de gestión logística - €4,500', 'warning', false, '2024-12-28 11:35:00+00'),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Solicitud completada', 'La instalación de red empresarial ha sido completada exitosamente', 'success', true, '2024-12-22 17:35:00+00'),

-- System notifications
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Informe mensual disponible', 'El informe de servicios de diciembre está listo para revisión', 'info', false, '2024-12-29 08:00:00+00'),
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'Mantenimiento programado', 'El sistema estará en mantenimiento el 1 de enero de 02:00 a 04:00', 'warning', false, '2024-12-28 12:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample audit logs
INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details, ip_address, user_agent, timestamp) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'LOGIN', 'auth', '550e8400-e29b-41d4-a716-446655440001', '{"success": true, "method": "email_password"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-12-29 08:30:00+00'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'CREATE', 'service_requests', '750e8400-e29b-41d4-a716-446655440012', '{"priority": "urgent", "client": "Tecnologías Avanzadas S.L.", "type": "emergency_support"}', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-12-29 13:45:00+00'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'UPDATE', 'service_requests', '750e8400-e29b-41d4-a716-446655440001', '{"status_changed": "pending -> approved", "assigned_technician": "Roberto López"}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-12-18 10:15:00+00'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'service_requests', '750e8400-e29b-41d4-a716-446655440001', '{"status_changed": "in_progress -> completed", "actual_cost": 2350.00}', '192.168.1.110', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2024-12-22 17:30:00+00'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'users', '550e8400-e29b-41d4-a716-446655440013', '{"role": "operator", "name": "Laura Jiménez", "department": "operations"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-05-05 09:30:00+00'),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'DELETE', 'service_requests', '750e8400-e29b-41d4-a716-446655440011', '{"reason": "cancelled_by_client", "original_cost": 200.00}', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-12-26 14:30:00+00'),
('950e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'clients', '650e8400-e29b-41d4-a716-446655440005', '{"contact_person_changed": "Juan Soler -> Marta Soler", "phone_updated": true}', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-11-15 14:20:00+00'),
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'LOGIN', 'auth', '550e8400-e29b-41d4-a716-446655440008', '{"success": true, "method": "email_password", "two_factor": false}', '192.168.1.115', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '2024-12-28 15:45:00+00'),
('950e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'EXPORT', 'reports', 'monthly_december_2024', '{"format": "PDF", "records_count": 156, "date_range": "2024-12-01 to 2024-12-31"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-12-28 16:45:00+00'),
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440009', 'UPDATE', 'service_requests', '750e8400-e29b-41d4-a716-446655440004', '{"notes_updated": true, "progress": "vulnerabilities_detected"}', '192.168.1.112', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0', '2024-12-28 15:20:00+00')
ON CONFLICT (id) DO NOTHING;