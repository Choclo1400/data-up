/*
  # Datos de Prueba Comprensivos para Sistema de Gestión de Servicios Técnicos

  1. Datos Adicionales
    - 15 usuarios adicionales con roles variados
    - 25 clientes adicionales (individuales y empresas)
    - 30 solicitudes de servicio con estados diversos
    - 20 notificaciones del sistema
    - 25 registros de auditoría
    - Datos para reportes y configuración

  2. Características
    - Datos realistas en español
    - Información de contacto completa
    - Fechas y horarios variados
    - Escenarios de uso diversos
    - Cobertura completa del sistema

  3. Cobertura de Funcionalidades
    - Dashboard con métricas variadas
    - Solicitudes en todos los estados
    - Clientes de diferentes tipos y sectores
    - Usuarios con diferentes niveles de acceso
    - Técnicos especializados
    - Datos para reportes detallados
*/

-- Insertar usuarios adicionales con roles variados
INSERT INTO users (id, email, password_hash, name, role, is_active, two_factor_enabled, last_login, created_at, updated_at) VALUES

-- Administradores adicionales
('a50e8400-e29b-41d4-a716-446655440001', 'admin.sistemas@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Patricia Vega Sistemas', 'admin', true, true, '2025-01-29 09:15:00+00', '2024-06-01 08:00:00+00', '2025-01-29 09:15:00+00'),
('a50e8400-e29b-41d4-a716-446655440002', 'admin.seguridad@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Fernando Ruiz Seguridad', 'admin', true, true, '2025-01-29 07:30:00+00', '2024-06-15 10:30:00+00', '2025-01-29 07:30:00+00'),

-- Gerentes adicionales
('a50e8400-e29b-41d4-a716-446655440003', 'gerente.operaciones@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Carmen Jiménez Operaciones', 'manager', true, true, '2025-01-29 08:45:00+00', '2024-07-01 09:15:00+00', '2025-01-29 08:45:00+00'),
('a50e8400-e29b-41d4-a716-446655440004', 'gerente.comercial@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Alberto Morales Comercial', 'manager', true, false, '2025-01-28 17:20:00+00', '2024-07-15 11:45:00+00', '2025-01-28 17:20:00+00'),
('a50e8400-e29b-41d4-a716-446655440005', 'gerente.calidad@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Isabel Torres Calidad', 'manager', true, true, '2025-01-29 09:00:00+00', '2024-08-01 14:20:00+00', '2025-01-29 09:00:00+00'),

-- Supervisores adicionales
('a50e8400-e29b-41d4-a716-446655440006', 'supervisor.turno1@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Ricardo Fernández Turno1', 'supervisor', true, false, '2025-01-29 06:00:00+00', '2024-08-15 07:30:00+00', '2025-01-29 06:00:00+00'),
('a50e8400-e29b-41d4-a716-446655440007', 'supervisor.turno2@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Mónica Castro Turno2', 'supervisor', true, true, '2025-01-28 22:15:00+00', '2024-09-01 13:45:00+00', '2025-01-28 22:15:00+00'),
('a50e8400-e29b-41d4-a716-446655440008', 'supervisor.emergencias@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Javier Ruiz Emergencias', 'supervisor', true, true, '2025-01-29 03:30:00+00', '2024-09-15 16:00:00+00', '2025-01-29 03:30:00+00'),

-- Técnicos especializados adicionales
('a50e8400-e29b-41d4-a716-446655440009', 'tecnico.redes@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Daniel Gómez Redes', 'technician', true, false, '2025-01-29 08:30:00+00', '2024-10-01 09:00:00+00', '2025-01-29 08:30:00+00'),
('a50e8400-e29b-41d4-a716-446655440010', 'tecnico.hardware@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Lucía Martín Hardware', 'technician', true, false, '2025-01-29 07:45:00+00', '2024-10-15 10:30:00+00', '2025-01-29 07:45:00+00'),
('a50e8400-e29b-41d4-a716-446655440011', 'tecnico.software@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Andrés Vega Software', 'technician', true, false, '2025-01-29 09:15:00+00', '2024-11-01 12:00:00+00', '2025-01-29 09:15:00+00'),
('a50e8400-e29b-41d4-a716-446655440012', 'tecnico.seguridad@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Cristina López Seguridad', 'technician', true, false, '2025-01-28 16:30:00+00', '2024-11-15 14:30:00+00', '2025-01-28 16:30:00+00'),
('a50e8400-e29b-41d4-a716-446655440013', 'tecnico.industrial@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Miguel Sánchez Industrial', 'technician', true, false, '2025-01-29 08:00:00+00', '2024-12-01 15:45:00+00', '2025-01-29 08:00:00+00'),
('a50e8400-e29b-41d4-a716-446655440014', 'tecnico.telecomunicaciones@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Sandra Herrera Telecom', 'technician', true, false, '2025-01-29 10:00:00+00', '2024-12-15 17:15:00+00', '2025-01-29 10:00:00+00'),

-- Operadores adicionales
('a50e8400-e29b-41d4-a716-446655440015', 'operador.central@techservice.com', '$2b$10$rQZ8kHp.fake.hash.example', 'Rosa Delgado Central', 'operator', true, false, '2025-01-29 07:00:00+00', '2025-01-01 08:00:00+00', '2025-01-29 07:00:00+00')

ON CONFLICT (id) DO NOTHING;

-- Insertar clientes adicionales variados
INSERT INTO clients (id, name, email, phone, address, type, contact_person, is_active, created_at, updated_at) VALUES

-- Clientes individuales adicionales
('c50e8400-e29b-41d4-a716-446655440001', 'Dr. Alejandro Ruiz Médico', 'alejandro.ruiz.medico@gmail.com', '+34 611 234 567', 'Calle Serrano 89, 28006 Madrid', 'individual', 'Dr. Alejandro Ruiz', true, '2024-05-10 10:30:00+00', '2024-05-10 10:30:00+00'),
('c50e8400-e29b-41d4-a716-446655440002', 'Arquitecta Elena Vega', 'elena.vega.arquitecta@hotmail.com', '+34 622 345 678', 'Passeig de Gràcia 125, 08008 Barcelona', 'individual', 'Elena Vega', true, '2024-05-15 14:20:00+00', '2024-05-15 14:20:00+00'),
('c50e8400-e29b-41d4-a716-446655440003', 'Abogado Carlos Mendoza', 'carlos.mendoza.abogado@yahoo.es', '+34 633 456 789', 'Avenida de la Constitución 45, 41001 Sevilla', 'individual', 'Carlos Mendoza', true, '2024-05-20 09:45:00+00', '2024-05-20 09:45:00+00'),
('c50e8400-e29b-41d4-a716-446655440004', 'Ingeniera Patricia López', 'patricia.lopez.ing@gmail.com', '+34 644 567 890', 'Calle Colón 67, 46004 Valencia', 'individual', 'Patricia López', true, '2024-05-25 16:15:00+00', '2024-05-25 16:15:00+00'),
('c50e8400-e29b-41d4-a716-446655440005', 'Contador Miguel Torres', 'miguel.torres.contador@outlook.com', '+34 655 678 901', 'Plaza del Pilar 23, 50003 Zaragoza', 'individual', 'Miguel Torres', true, '2024-06-01 11:30:00+00', '2024-06-01 11:30:00+00'),

-- Empresas de tecnología
('c50e8400-e29b-41d4-a716-446655440006', 'Innovación Digital Madrid S.L.', 'contacto@innovaciondigital.com', '+34 915 234 567', 'Parque Tecnológico de Madrid, Edificio 7, 28760 Tres Cantos', 'company', 'Director TI: Raúl Gómez', true, '2024-06-05 08:45:00+00', '2024-06-05 08:45:00+00'),
('c50e8400-e29b-41d4-a716-446655440007', 'Soluciones Cloud Barcelona', 'info@solucionescloud.es', '+34 934 345 678', 'Carrer de Pallars 193, 08005 Barcelona', 'company', 'CTO: Marina Fernández', true, '2024-06-10 13:20:00+00', '2024-06-10 13:20:00+00'),
('c50e8400-e29b-41d4-a716-446655440008', 'Ciberseguridad Andaluza', 'seguridad@ciberandaluza.com', '+34 954 456 789', 'Isla de la Cartuja, Edificio Tecnológico, 41092 Sevilla', 'company', 'CISO: Alberto Ruiz', true, '2024-06-15 15:50:00+00', '2024-06-15 15:50:00+00'),

-- Empresas industriales
('c50e8400-e29b-41d4-a716-446655440009', 'Manufacturas Precisión Levante', 'produccion@precisionlevante.com', '+34 963 567 890', 'Polígono Industrial Fuente del Jarro, Calle 15, 46988 Paterna', 'company', 'Jefe Producción: Carmen Vega', true, '2024-06-20 10:15:00+00', '2024-06-20 10:15:00+00'),
('c50e8400-e29b-41d4-a716-446655440010', 'Metalúrgica del Norte S.A.', 'mantenimiento@metalurgicadelnorte.es', '+34 985 678 901', 'Polígono de Silvota, Nave 45, 33192 Llanera, Asturias', 'company', 'Ing. Mantenimiento: José Luis Castro', true, '2024-06-25 12:40:00+00', '2024-06-25 12:40:00+00'),
('c50e8400-e29b-41d4-a716-446655440011', 'Química Farmacéutica Galicia', 'sistemas@quimicagalicia.com', '+34 981 789 012', 'Polígono de Sabón, Parcela 78, 15142 A Coruña', 'company', 'Responsable IT: Dra. Laura Martínez', true, '2024-07-01 09:25:00+00', '2024-07-01 09:25:00+00'),

-- Empresas de servicios
('c50e8400-e29b-41d4-a716-446655440012', 'Consultoría Empresarial Castilla', 'it@consultoriacastilla.es', '+34 983 890 123', 'Calle Miguel Íscar 18, 47001 Valladolid', 'company', 'Director IT: Francisco Jiménez', true, '2024-07-05 14:30:00+00', '2024-07-05 14:30:00+00'),
('c50e8400-e29b-41d4-a716-446655440013', 'Logística Integral Mediterráneo', 'sistemas@logisticamediterraneo.com', '+34 968 901 234', 'Polígono Industrial Oeste, Calle A, 30169 San Ginés, Murcia', 'company', 'Jefe Sistemas: Ana Belén Soto', true, '2024-07-10 16:45:00+00', '2024-07-10 16:45:00+00'),
('c50e8400-e29b-41d4-a716-446655440014', 'Centro Médico Especializado', 'informatica@centromedicoesp.com', '+34 924 012 345', 'Avenida de Europa 89, 06800 Mérida, Badajoz', 'company', 'Responsable Informática: Dr. Manuel Herrera', true, '2024-07-15 11:20:00+00', '2024-07-15 11:20:00+00'),

-- Empresas educativas y culturales
('c50e8400-e29b-41d4-a716-446655440015', 'Instituto Tecnológico Superior', 'tic@institutotecnologico.edu', '+34 942 123 456', 'Avenida de los Castros 52, 39005 Santander', 'company', 'Coordinador TIC: Prof. Elena Ruiz', true, '2024-07-20 08:50:00+00', '2024-07-20 08:50:00+00'),
('c50e8400-e29b-41d4-a716-446655440016', 'Fundación Cultural Extremadura', 'tecnologia@fundacionextremadura.org', '+34 927 234 567', 'Plaza Mayor 1, 10003 Cáceres', 'company', 'Técnico Audiovisual: Carlos Delgado', true, '2024-07-25 13:15:00+00', '2024-07-25 13:15:00+00'),

-- Empresas de hostelería y turismo
('c50e8400-e29b-41d4-a716-446655440017', 'Cadena Hotelera Costa Brava', 'sistemas@hotelescostabrava.com', '+34 972 345 678', 'Passeig Marítim 45, 17310 Lloret de Mar, Girona', 'company', 'Director Sistemas: Roberto Valls', true, '2024-08-01 15:30:00+00', '2024-08-01 15:30:00+00'),
('c50e8400-e29b-41d4-a716-446655440018', 'Restaurantes Gourmet Canarias', 'tecnologia@gourmetcanarias.com', '+34 928 456 789', 'Calle Triana 123, 35002 Las Palmas de Gran Canaria', 'company', 'Jefe Operaciones: María José Santana', true, '2024-08-05 10:45:00+00', '2024-08-05 10:45:00+00'),

-- Empresas de transporte y logística
('c50e8400-e29b-41d4-a716-446655440019', 'Transportes Rápidos Península', 'it@transportesrapidos.es', '+34 976 567 890', 'Polígono Empresarial Centrovía, Nave 12, 50720 Cartuja Baja, Zaragoza', 'company', 'Responsable Flota: Javier Moreno', true, '2024-08-10 12:20:00+00', '2024-08-10 12:20:00+00'),
('c50e8400-e29b-41d4-a716-446655440020', 'Distribución Nacional Express', 'sistemas@distribucionexpress.com', '+34 925 678 901', 'Autovía A-4, Km 65, 45200 Illescas, Toledo', 'company', 'Director Logística: Sandra Morales', true, '2024-08-15 14:35:00+00', '2024-08-15 14:35:00+00'),

-- Empresas financieras y seguros
('c50e8400-e29b-41d4-a716-446655440021', 'Asesoría Fiscal Rioja', 'informatica@asesoriarioja.com', '+34 941 789 012', 'Calle Portales 34, 26001 Logroño', 'company', 'Responsable IT: Luis Fernando Ruiz', true, '2024-08-20 09:10:00+00', '2024-08-20 09:10:00+00'),
('c50e8400-e29b-41d4-a716-446655440022', 'Correduría de Seguros Levante', 'sistemas@seguroslevante.es', '+34 965 890 123', 'Avenida de la Estación 67, 03202 Elche, Alicante', 'company', 'Analista Sistemas: Patricia Navarro', true, '2024-08-25 16:25:00+00', '2024-08-25 16:25:00+00'),

-- Empresas de construcción y arquitectura
('c50e8400-e29b-41d4-a716-446655440023', 'Constructora Obras Públicas', 'tecnologia@constructoraop.com', '+34 987 901 234', 'Polígono Industrial del Bierzo, Calle 8, 24400 Ponferrada, León', 'company', 'Ing. Proyectos: Fernando Castro', true, '2024-09-01 11:40:00+00', '2024-09-01 11:40:00+00'),
('c50e8400-e29b-41d4-a716-446655440024', 'Estudio Arquitectura Moderna', 'cad@arquitecturamoderna.es', '+34 956 012 345', 'Calle Ancha 89, 11001 Cádiz', 'company', 'Arquitecto Jefe: Dra. Carmen Jiménez', true, '2024-09-05 13:55:00+00', '2024-09-05 13:55:00+00'),

-- Empresas de energía y medio ambiente
('c50e8400-e29b-41d4-a716-446655440025', 'Energías Renovables Castilla-León', 'control@energiasrenovables.com', '+34 979 123 456', 'Parque Eólico Norte, Km 15, 34004 Palencia', 'company', 'Ing. Control: Alberto Fernández', true, '2024-09-10 08:30:00+00', '2024-09-10 08:30:00+00')

ON CONFLICT (id) DO NOTHING;

-- Insertar solicitudes de servicio adicionales con gran variedad
INSERT INTO service_requests (id, client_id, service_type, description, priority, status, assigned_technician_id, approved_by_id, scheduled_date, completed_date, estimated_cost, actual_cost, materials, notes, attachments, created_at, updated_at) VALUES

-- Solicitudes completadas recientes
('s50e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440006', 'network_installation', 'Instalación completa de red corporativa con fibra óptica. Configuración de 3 switches principales, 15 access points WiFi 6 y sistema de monitorización centralizado.', 'high', 'completed', 'a50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440003', '2025-01-15 08:00:00+00', '2025-01-18 17:30:00+00', 8500.00, 8200.00, '[{"item": "Switch Cisco Catalyst 9300", "quantity": 3, "cost": 4500.00}, {"item": "Access Points WiFi 6", "quantity": 15, "cost": 2250.00}, {"item": "Fibra óptica monomodo", "quantity": 500, "unit": "metros", "cost": 750.00}, {"item": "Sistema monitorización", "quantity": 1, "cost": 700.00}]', 'Instalación exitosa. Red funcionando a máximo rendimiento. Cliente muy satisfecho con la velocidad y cobertura.', '[]', '2025-01-10 09:30:00+00', '2025-01-18 17:30:00+00'),

('s50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440008', 'security_audit', 'Auditoría completa de ciberseguridad incluyendo test de penetración, análisis de vulnerabilidades y evaluación de políticas de seguridad.', 'urgent', 'completed', 'a50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440004', '2025-01-12 09:00:00+00', '2025-01-16 18:00:00+00', 3200.00, 3450.00, '[{"item": "Herramientas auditoría avanzada", "quantity": 1, "cost": 800.00}, {"item": "Test penetración especializado", "quantity": 32, "unit": "horas", "cost": 2400.00}, {"item": "Informe detallado", "quantity": 1, "cost": 250.00}]', 'Auditoría completada. Se detectaron 3 vulnerabilidades críticas que fueron corregidas. Informe entregado con recomendaciones.', '[]', '2025-01-08 14:20:00+00', '2025-01-16 18:00:00+00'),

('s50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440009', 'equipment_maintenance', 'Mantenimiento preventivo anual de sistemas industriales. Revisión de PLCs, sistemas SCADA y equipos de control de procesos.', 'medium', 'completed', 'a50e8400-e29b-41d4-a716-446655440013', 'a50e8400-e29b-41d4-a716-446655440006', '2025-01-20 07:00:00+00', '2025-01-22 19:00:00+00', 2800.00, 2650.00, '[{"item": "Repuestos PLC Siemens", "quantity": 8, "cost": 1200.00}, {"item": "Software actualización SCADA", "quantity": 1, "cost": 600.00}, {"item": "Calibración sensores", "quantity": 12, "cost": 480.00}, {"item": "Lubricantes industriales", "quantity": 5, "cost": 370.00}]', 'Mantenimiento completado sin incidencias. Todos los sistemas funcionando óptimamente. Próxima revisión programada en 6 meses.', '[]', '2025-01-15 10:45:00+00', '2025-01-22 19:00:00+00'),

-- Solicitudes en progreso
('s50e8400-e29b-41d4-a716-446655440004', 'c50e8400-e29b-41d4-a716-446655440007', 'cloud_migration', 'Migración completa de infraestructura local a AWS. Incluye migración de 15 servidores, configuración de VPC y implementación de backup automático.', 'high', 'in_progress', 'a50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440005', '2025-01-25 08:00:00+00', null, 12000.00, null, '[{"item": "Instancias AWS EC2", "quantity": 15, "cost": 4500.00}, {"item": "Almacenamiento S3", "quantity": 10, "unit": "TB", "cost": 2300.00}, {"item": "Configuración VPC", "quantity": 1, "cost": 800.00}, {"item": "Servicios migración", "quantity": 80, "unit": "horas", "cost": 4400.00}]', 'Migración en progreso. 8 de 15 servidores ya migrados. Configuración de red completada. Estimado finalización: 3 días.', '[]', '2025-01-22 11:15:00+00', '2025-01-29 16:30:00+00'),

('s50e8400-e29b-41d4-a716-446655440005', 'c50e8400-e29b-41d4-a716-446655440017', 'system_integration', 'Integración de sistema PMS hotelero con plataforma de reservas online y sistema de facturación. Desarrollo de APIs personalizadas.', 'medium', 'in_progress', 'a50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440003', '2025-01-28 09:00:00+00', null, 5500.00, null, '[{"item": "Desarrollo APIs", "quantity": 60, "unit": "horas", "cost": 3600.00}, {"item": "Licencias middleware", "quantity": 2, "cost": 1200.00}, {"item": "Testing integración", "quantity": 20, "unit": "horas", "cost": 700.00}]', 'Desarrollo de APIs al 70%. Integración con PMS completada. Pendiente testing final y puesta en producción.', '[]', '2025-01-24 13:40:00+00', '2025-01-29 14:20:00+00'),

('s50e8400-e29b-41d4-a716-446655440006', 'c50e8400-e29b-41d4-a716-446655440011', 'data_recovery', 'Recuperación urgente de datos de servidor RAID que sufrió fallo múltiple de discos. Base de datos crítica de producción farmacéutica.', 'urgent', 'in_progress', 'a50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440004', '2025-01-29 06:00:00+00', null, 4200.00, null, '[{"item": "Discos duros enterprise", "quantity": 4, "cost": 1600.00}, {"item": "Software recuperación profesional", "quantity": 1, "cost": 1200.00}, {"item": "Servicio emergencia 24h", "quantity": 24, "unit": "horas", "cost": 1400.00}]', 'CRÍTICO: Recuperación en curso. 85% de datos recuperados. Trabajando 24h para minimizar tiempo de inactividad.', '[]', '2025-01-29 05:30:00+00', '2025-01-29 18:45:00+00'),

-- Solicitudes aprobadas pendientes de inicio
('s50e8400-e29b-41d4-a716-446655440007', 'c50e8400-e29b-41d4-a716-446655440015', 'network_upgrade', 'Actualización completa de infraestructura de red del instituto. Instalación de switches gestionables y ampliación de ancho de banda.', 'medium', 'approved', 'a50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440005', '2025-02-03 08:00:00+00', null, 6800.00, null, '[{"item": "Switches gestionables", "quantity": 8, "cost": 3200.00}, {"item": "Fibra óptica", "quantity": 800, "unit": "metros", "cost": 1200.00}, {"item": "Ampliación ancho banda", "quantity": 1, "cost": 1800.00}, {"item": "Configuración avanzada", "quantity": 40, "unit": "horas", "cost": 600.00}]', 'Proyecto aprobado para período no lectivo. Instalación programada durante vacaciones de febrero.', '[]', '2025-01-25 09:20:00+00', '2025-01-26 10:15:00+00'),

('s50e8400-e29b-41d4-a716-446655440008', 'c50e8400-e29b-41d4-a716-446655440012', 'software_development', 'Desarrollo de aplicación web personalizada para gestión de consultoría. Incluye CRM, facturación y reporting avanzado.', 'medium', 'approved', 'a50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440003', '2025-02-05 09:00:00+00', null, 15000.00, null, '[{"item": "Desarrollo frontend", "quantity": 120, "unit": "horas", "cost": 7200.00}, {"item": "Desarrollo backend", "quantity": 100, "unit": "horas", "cost": 6000.00}, {"item": "Base de datos", "quantity": 1, "cost": 800.00}, {"item": "Testing y QA", "quantity": 40, "unit": "horas", "cost": 1000.00}]', 'Proyecto aprobado. Reunión de kick-off programada. Entrega estimada en 3 meses.', '[]', '2025-01-28 14:30:00+00', '2025-01-29 09:45:00+00'),

-- Solicitudes pendientes de aprobación
('s50e8400-e29b-41d4-a716-446655440009', 'c50e8400-e29b-41d4-a716-446655440019', 'fleet_management', 'Implementación de sistema de gestión de flota con GPS, telemetría y optimización de rutas para 150 vehículos.', 'high', 'pending', null, null, null, null, 25000.00, null, '[{"item": "Dispositivos GPS", "quantity": 150, "cost": 9000.00}, {"item": "Software gestión flota", "quantity": 1, "cost": 8000.00}, {"item": "Instalación y configuración", "quantity": 200, "unit": "horas", "cost": 6000.00}, {"item": "Formación usuarios", "quantity": 40, "unit": "horas", "cost": 2000.00}]', 'Solicitud de alto valor pendiente de aprobación por comité directivo. ROI estimado en 18 meses.', '[]', '2025-01-27 10:15:00+00', '2025-01-27 10:15:00+00'),

('s50e8400-e29b-41d4-a716-446655440010', 'c50e8400-e29b-41d4-a716-446655440014', 'medical_system', 'Instalación de sistema de gestión hospitalaria integrado con equipos médicos y laboratorio.', 'high', 'pending', null, null, null, null, 18500.00, null, '[{"item": "Software HIS", "quantity": 1, "cost": 12000.00}, {"item": "Integración equipos médicos", "quantity": 25, "cost": 3750.00}, {"item": "Migración datos", "quantity": 80, "unit": "horas", "cost": 2400.00}, {"item": "Certificación sanitaria", "quantity": 1, "cost": 350.00}]', 'Pendiente aprobación dirección médica. Requiere certificaciones específicas del sector sanitario.', '[]', '2025-01-28 16:20:00+00', '2025-01-28 16:20:00+00'),

('s50e8400-e29b-41d4-a716-446655440011', 'c50e8400-e29b-41d4-a716-446655440001', 'home_automation', 'Instalación de sistema domótico completo en consulta médica. Control de iluminación, climatización y seguridad.', 'low', 'pending', null, null, null, null, 3200.00, null, '[{"item": "Central domótica", "quantity": 1, "cost": 800.00}, {"item": "Sensores y actuadores", "quantity": 15, "cost": 1200.00}, {"item": "Cámaras seguridad", "quantity": 4, "cost": 600.00}, {"item": "Instalación y programación", "quantity": 20, "unit": "horas", "cost": 600.00}]', 'Cliente solicita presupuesto detallado. Pendiente visita técnica para evaluación completa.', '[]', '2025-01-29 11:30:00+00', '2025-01-29 11:30:00+00'),

-- Solicitudes de mantenimiento rutinario
('s50e8400-e29b-41d4-a716-446655440012', 'c50e8400-e29b-41d4-a716-446655440020', 'preventive_maintenance', 'Mantenimiento preventivo trimestral de sistemas informáticos de centro logístico. Revisión de servidores y equipos de red.', 'low', 'approved', 'a50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440006', '2025-02-01 07:00:00+00', null, 850.00, null, '[{"item": "Limpieza equipos", "quantity": 1, "cost": 150.00}, {"item": "Actualización firmware", "quantity": 12, "cost": 240.00}, {"item": "Revisión conexiones", "quantity": 8, "unit": "horas", "cost": 320.00}, {"item": "Informe estado", "quantity": 1, "cost": 140.00}]', 'Mantenimiento rutinario programado. Sin incidencias previstas.', '[]', '2025-01-26 15:45:00+00', '2025-01-27 08:30:00+00'),

-- Solicitudes de emergencia
('s50e8400-e29b-41d4-a716-446655440013', 'c50e8400-e29b-41d4-a716-446655440018', 'emergency_support', 'Caída total del sistema de reservas durante temporada alta. Pérdida de conectividad con plataformas de booking online.', 'urgent', 'in_progress', 'a50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440008', '2025-01-29 19:00:00+00', null, 1200.00, null, '[{"item": "Servicio emergencia nocturno", "quantity": 8, "unit": "horas", "cost": 800.00}, {"item": "Equipos reemplazo", "quantity": 2, "cost": 400.00}]', 'EMERGENCIA: Técnico en sitio. Problema identificado en router principal. Reemplazo en curso.', '[]', '2025-01-29 18:45:00+00', '2025-01-29 19:30:00+00'),

-- Solicitudes de formación y consultoría
('s50e8400-e29b-41d4-a716-446655440014', 'c50e8400-e29b-41d4-a716-446655440016', 'training', 'Formación especializada en nuevas tecnologías audiovisuales para personal técnico de fundación cultural.', 'medium', 'approved', 'a50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440005', '2025-02-10 09:00:00+00', null, 2400.00, null, '[{"item": "Curso especializado", "quantity": 24, "unit": "horas", "cost": 1800.00}, {"item": "Material didáctico", "quantity": 8, "cost": 320.00}, {"item": "Certificación", "quantity": 8, "cost": 280.00}]', 'Formación aprobada para 8 técnicos. Modalidad presencial en instalaciones del cliente.', '[]', '2025-01-24 12:10:00+00', '2025-01-25 14:20:00+00'),

-- Solicitudes canceladas
('s50e8400-e29b-41d4-a716-446655440015', 'c50e8400-e29b-41d4-a716-446655440002', 'office_relocation', 'Traslado completo de infraestructura IT de oficina de arquitectura. Desmontaje, transporte y reinstalación.', 'medium', 'cancelled', null, null, null, null, 4500.00, null, '[]', 'Cliente canceló traslado de oficina por cambios en planificación empresarial.', '[]', '2025-01-20 09:30:00+00', '2025-01-23 11:45:00+00'),

-- Solicitudes de actualización de software
('s50e8400-e29b-41d4-a716-446655440016', 'c50e8400-e29b-41d4-a716-446655440021', 'software_upgrade', 'Actualización de software contable a nueva versión con módulos de facturación electrónica y reporting avanzado.', 'medium', 'completed', 'a50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440003', '2025-01-22 08:00:00+00', '2025-01-24 17:00:00+00', 2800.00, 2650.00, '[{"item": "Licencias software", "quantity": 5, "cost": 1500.00}, {"item": "Migración datos", "quantity": 16, "unit": "horas", "cost": 800.00}, {"item": "Formación usuarios", "quantity": 8, "unit": "horas", "cost": 320.00}, {"item": "Soporte post-instalación", "quantity": 1, "cost": 30.00}]', 'Actualización completada exitosamente. Personal formado en nuevas funcionalidades. Sistema funcionando correctamente.', '[]', '2025-01-18 14:15:00+00', '2025-01-24 17:00:00+00'),

-- Solicitudes de instalación de equipos
('s50e8400-e29b-41d4-a716-446655440017', 'c50e8400-e29b-41d4-a716-446655440022', 'hardware_installation', 'Instalación de nuevo servidor para correduría de seguros. Configuración de alta disponibilidad y backup automático.', 'high', 'approved', 'a50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440004', '2025-02-01 08:00:00+00', null, 5200.00, null, '[{"item": "Servidor Dell PowerEdge", "quantity": 1, "cost": 3500.00}, {"item": "Discos SSD", "quantity": 4, "cost": 800.00}, {"item": "Configuración HA", "quantity": 16, "unit": "horas", "cost": 640.00}, {"item": "Sistema backup", "quantity": 1, "cost": 260.00}]', 'Servidor adquirido. Instalación programada para fin de semana para minimizar interrupciones.', '[]', '2025-01-26 10:20:00+00', '2025-01-27 16:40:00+00'),

-- Solicitudes de consultoría especializada
('s50e8400-e29b-41d4-a716-446655440018', 'c50e8400-e29b-41d4-a716-446655440023', 'consulting', 'Consultoría para optimización de procesos digitales en constructora. Análisis de flujos de trabajo y propuesta de mejoras.', 'medium', 'in_progress', 'a50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440005', '2025-01-26 09:00:00+00', null, 3600.00, null, '[{"item": "Análisis procesos", "quantity": 32, "unit": "horas", "cost": 2400.00}, {"item": "Propuesta mejoras", "quantity": 16, "unit": "horas", "cost": 800.00}, {"item": "Documentación", "quantity": 8, "unit": "horas", "cost": 400.00}]', 'Análisis en curso. Identificadas 5 áreas de mejora principales. Elaborando propuesta detallada.', '[]', '2025-01-22 11:50:00+00', '2025-01-29 15:10:00+00'),

-- Solicitudes de monitorización
('s50e8400-e29b-41d4-a716-446655440019', 'c50e8400-e29b-41d4-a716-446655440025', 'monitoring_setup', 'Implementación de sistema de monitorización para parque eólico. Control remoto de aerogeneradores y estación meteorológica.', 'high', 'pending', null, null, null, null, 12500.00, null, '[{"item": "Sistema SCADA", "quantity": 1, "cost": 6000.00}, {"item": "Sensores meteorológicos", "quantity": 8, "cost": 2400.00}, {"item": "Comunicaciones remotas", "quantity": 1, "cost": 2100.00}, {"item": "Software monitorización", "quantity": 1, "cost": 2000.00}]', 'Proyecto complejo pendiente de aprobación técnica. Requiere coordinación con ingeniería eólica.', '[]', '2025-01-29 13:25:00+00', '2025-01-29 13:25:00+00'),

-- Solicitud de reparación urgente
('s50e8400-e29b-41d4-a716-446655440020', 'c50e8400-e29b-41d4-a716-446655440003', 'hardware_repair', 'Reparación urgente de equipo de diagnóstico médico. Fallo en sistema de comunicaciones que impide envío de resultados.', 'urgent', 'approved', 'a50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440008', '2025-01-30 08:00:00+00', null, 1800.00, null, '[{"item": "Tarjeta comunicaciones", "quantity": 1, "cost": 650.00}, {"item": "Diagnóstico especializado", "quantity": 8, "unit": "horas", "cost": 800.00}, {"item": "Calibración post-reparación", "quantity": 4, "unit": "horas", "cost": 350.00}]', 'Reparación crítica aprobada. Técnico especializado asignado. Repuesto en camino.', '[]', '2025-01-29 16:40:00+00', '2025-01-29 17:15:00+00')

ON CONFLICT (id) DO NOTHING;

-- Insertar notificaciones adicionales del sistema
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES

-- Notificaciones para técnicos
('n50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440009', 'Nueva asignación prioritaria', 'Se te ha asignado la solicitud #s50e8400-e29b-41d4-a716-446655440007 - Actualización de red del Instituto Tecnológico', 'info', false, '2025-01-26 10:15:00+00'),
('n50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440010', 'Emergencia crítica asignada', 'URGENTE: Recuperación de datos farmacéutica - Cliente esperando. Prioridad máxima.', 'error', false, '2025-01-29 05:30:00+00'),
('n50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440011', 'Proyecto de desarrollo aprobado', 'El proyecto de desarrollo web para Consultoría Castilla ha sido aprobado. Reunión kick-off mañana 09:00.', 'success', false, '2025-01-29 09:45:00+00'),
('n50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440012', 'Reparación médica urgente', 'Asignada reparación de equipo diagnóstico. Cliente: Dr. Carlos Mendoza. Cita programada mañana 08:00.', 'warning', false, '2025-01-29 17:15:00+00'),
('n50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440013', 'Mantenimiento completado', 'Mantenimiento industrial en Manufacturas Precisión finalizado exitosamente. Cliente muy satisfecho.', 'success', true, '2025-01-22 19:00:00+00'),

-- Notificaciones para supervisores
('n50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440006', 'Revisión de turno requerida', 'Técnico Daniel Gómez requiere apoyo en instalación de red. Evaluar asignación de recurso adicional.', 'warning', false, '2025-01-29 14:30:00+00'),
('n50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440007', 'Emergencia en turno nocturno', 'Sistema de reservas hoteleras caído. Técnico Sandra Herrera desplegada. Monitorear progreso.', 'error', false, '2025-01-29 19:30:00+00'),
('n50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440008', 'Solicitud de emergencia resuelta', 'Recuperación de datos farmacéutica completada al 85%. Cliente informado. Situación bajo control.', 'success', true, '2025-01-29 18:45:00+00'),

-- Notificaciones para gerentes
('n50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440003', 'Aprobación requerida - Alto valor', 'Solicitud de gestión de flota por €25,000 pendiente de aprobación. Cliente: Transportes Rápidos Península.', 'warning', false, '2025-01-27 10:15:00+00'),
('n50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440004', 'Proyecto médico pendiente', 'Sistema hospitalario por €18,500 requiere aprobación directiva. Incluye certificaciones sanitarias.', 'warning', false, '2025-01-28 16:20:00+00'),
('n50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440005', 'Migración cloud en progreso', 'Migración AWS al 53% completada. Sin incidencias. Finalización estimada en 3 días.', 'info', true, '2025-01-29 16:30:00+00'),
('n50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440003', 'Cliente VIP satisfecho', 'Innovación Digital Madrid califica servicio como excelente. Solicitan reunión para nuevos proyectos.', 'success', true, '2025-01-18 17:30:00+00'),

-- Notificaciones del sistema
('n50e8400-e29b-41d4-a716-446655440013', 'a50e8400-e29b-41d4-a716-446655440001', 'Informe mensual enero disponible', 'El informe de servicios de enero 2025 está listo. 47 solicitudes completadas, 15 en progreso.', 'info', false, '2025-01-30 08:00:00+00'),
('n50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440002', 'Actualización de seguridad', 'Nueva actualización de seguridad disponible. Programar instalación para próximo mantenimiento.', 'warning', false, '2025-01-29 12:00:00+00'),
('n50e8400-e29b-41d4-a716-446655440015', 'a50e8400-e29b-41d4-a716-446655440001', 'Backup automático completado', 'Backup semanal completado exitosamente. Todos los datos seguros. Próximo backup: 05/02/2025.', 'success', true, '2025-01-26 03:00:00+00'),

-- Notificaciones de formación
('n50e8400-e29b-41d4-a716-446655440016', 'a50e8400-e29b-41d4-a716-446655440014', 'Formación audiovisual confirmada', 'Formación en Fundación Cultural confirmada para 10/02. 8 participantes registrados.', 'info', false, '2025-01-25 14:20:00+00'),
('n50e8400-e29b-41d4-a716-446655440017', 'a50e8400-e29b-41d4-a716-446655440011', 'Certificación completada', 'Certificación en desarrollo web renovada exitosamente. Válida hasta enero 2027.', 'success', true, '2025-01-15 16:45:00+00'),

-- Notificaciones de mantenimiento
('n50e8400-e29b-41d4-a716-446655440018', 'a50e8400-e29b-41d4-a716-446655440010', 'Mantenimiento programado', 'Mantenimiento preventivo en Distribución Express programado para 01/02 a las 07:00.', 'info', false, '2025-01-27 08:30:00+00'),
('n50e8400-e29b-41d4-a716-446655440019', 'a50e8400-e29b-41d4-a716-446655440013', 'Repuestos industriales recibidos', 'Repuestos para mantenimiento de Metalúrgica del Norte han llegado. Listo para instalación.', 'success', true, '2025-01-20 10:15:00+00'),

-- Notificación de rendimiento
('n50e8400-e29b-41d4-a716-446655440020', 'a50e8400-e29b-41d4-a716-446655440009', 'Reconocimiento por excelencia', 'Felicitaciones por completar la instalación de red en tiempo récord. Cliente extremadamente satisfecho.', 'success', true, '2025-01-18 17:30:00+00')

ON CONFLICT (id) DO NOTHING;

-- Insertar registros de auditoría adicionales
INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details, ip_address, user_agent, timestamp) VALUES

-- Logins recientes
('l50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440009', 'LOGIN', 'auth', 'a50e8400-e29b-41d4-a716-446655440009', '{"success": true, "method": "email_password", "location": "Madrid"}', '192.168.1.120', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-29 08:30:00+00'),
('l50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440010', 'LOGIN', 'auth', 'a50e8400-e29b-41d4-a716-446655440010', '{"success": true, "method": "email_password", "location": "Barcelona"}', '192.168.1.125', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-01-29 07:45:00+00'),
('l50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440011', 'LOGIN', 'auth', 'a50e8400-e29b-41d4-a716-446655440011', '{"success": true, "method": "email_password", "location": "Valencia"}', '192.168.1.130', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-01-29 09:15:00+00'),

-- Creación de solicitudes
('l50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440003', 'CREATE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440001', '{"priority": "high", "client": "Innovación Digital Madrid S.L.", "type": "network_installation", "estimated_cost": 8500.00}', '192.168.1.135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-10 09:30:00+00'),
('l50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440004', 'CREATE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440006', '{"priority": "urgent", "client": "Química Farmacéutica Galicia", "type": "data_recovery", "estimated_cost": 4200.00}', '192.168.1.140', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '2025-01-29 05:30:00+00'),

-- Actualizaciones de estado
('l50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440009', 'UPDATE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440001', '{"status_changed": "in_progress -> completed", "actual_cost": 8200.00, "completion_time": "3_days"}', '192.168.1.120', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-18 17:30:00+00'),
('l50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440012', 'UPDATE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440002', '{"status_changed": "in_progress -> completed", "vulnerabilities_found": 3, "vulnerabilities_fixed": 3}', '192.168.1.145', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0', '2025-01-16 18:00:00+00'),

-- Aprobaciones
('l50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440005', 'APPROVE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440007', '{"approved_amount": 6800.00, "approval_reason": "infrastructure_upgrade", "scheduled_date": "2025-02-03"}', '192.168.1.150', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-26 10:15:00+00'),
('l50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440003', 'APPROVE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440008', '{"approved_amount": 15000.00, "approval_reason": "custom_development", "project_duration": "3_months"}', '192.168.1.135', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-01-29 09:45:00+00'),

-- Creación de clientes
('l50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440003', 'CREATE', 'clients', 'c50e8400-e29b-41d4-a716-446655440006', '{"type": "company", "sector": "technology", "contact_person": "Raúl Gómez"}', '192.168.1.135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-06-05 08:45:00+00'),
('l50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440004', 'CREATE', 'clients', 'c50e8400-e29b-41d4-a716-446655440014', '{"type": "company", "sector": "healthcare", "contact_person": "Dr. Manuel Herrera"}', '192.168.1.140', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '2024-07-15 11:20:00+00'),

-- Actualizaciones de usuarios
('l50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'users', 'a50e8400-e29b-41d4-a716-446655440014', '{"role_changed": "technician -> technician", "specialization_added": "telecommunications", "certification_updated": true}', '192.168.1.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-12-15 17:15:00+00'),
('l50e8400-e29b-41d4-a716-446655440013', 'a50e8400-e29b-41d4-a716-446655440001', 'CREATE', 'users', 'a50e8400-e29b-41d4-a716-446655440015', '{"role": "operator", "name": "Rosa Delgado Central", "department": "operations"}', '192.168.1.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-01 08:00:00+00'),

-- Exportación de reportes
('l50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440003', 'EXPORT', 'reports', 'monthly_january_2025', '{"format": "PDF", "records_count": 62, "date_range": "2025-01-01 to 2025-01-31", "report_type": "service_summary"}', '192.168.1.135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-30 08:00:00+00'),
('l50e8400-e29b-41d4-a716-446655440015', 'a50e8400-e29b-41d4-a716-446655440004', 'EXPORT', 'reports', 'technician_performance_q1', '{"format": "Excel", "records_count": 15, "date_range": "2025-01-01 to 2025-01-31", "report_type": "performance"}', '192.168.1.140', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-01-29 16:45:00+00'),

-- Acciones de emergencia
('l50e8400-e29b-41d4-a716-446655440016', 'a50e8400-e29b-41d4-a716-446655440008', 'EMERGENCY_ASSIGN', 'service_requests', 's50e8400-e29b-41d4-a716-446655440013', '{"emergency_type": "system_down", "response_time": "15_minutes", "technician_assigned": "Sandra Herrera"}', '192.168.1.160', 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/119.0 Firefox/119.0', '2025-01-29 19:00:00+00'),
('l50e8400-e29b-41d4-a716-446655440017', 'a50e8400-e29b-41d4-a716-446655440008', 'EMERGENCY_RESOLVE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440006', '{"resolution_status": "85_percent_recovered", "downtime": "13_hours", "data_loss": "minimal"}', '192.168.1.160', 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/119.0 Firefox/119.0', '2025-01-29 18:45:00+00'),

-- Configuración del sistema
('l50e8400-e29b-41d4-a716-446655440018', 'a50e8400-e29b-41d4-a716-446655440001', 'CONFIG_UPDATE', 'system', 'notification_settings', '{"email_notifications": true, "sms_alerts": true, "emergency_escalation": "enabled"}', '192.168.1.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-28 14:30:00+00'),
('l50e8400-e29b-41d4-a716-446655440019', 'a50e8400-e29b-41d4-a716-446655440002', 'CONFIG_UPDATE', 'system', 'backup_schedule', '{"frequency": "daily", "retention": "30_days", "cloud_backup": "enabled"}', '192.168.1.165', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-25 09:15:00+00'),

-- Intentos de login fallidos
('l50e8400-e29b-41d4-a716-446655440020', null, 'LOGIN_FAILED', 'auth', 'unknown_user', '{"email": "hacker@malicious.com", "reason": "invalid_credentials", "attempts": 3}', '203.0.113.45', 'curl/7.68.0', '2025-01-29 03:22:00+00'),
('l50e8400-e29b-41d4-a716-446655440021', null, 'LOGIN_FAILED', 'auth', 'unknown_user', '{"email": "admin@fake.com", "reason": "account_not_found", "attempts": 1}', '198.51.100.23', 'Mozilla/5.0 (compatible; BadBot/1.0)', '2025-01-28 22:15:00+00'),

-- Cambios de contraseña
('l50e8400-e29b-41d4-a716-446655440022', 'a50e8400-e29b-41d4-a716-446655440011', 'PASSWORD_CHANGE', 'auth', 'a50e8400-e29b-41d4-a716-446655440011', '{"method": "user_initiated", "strength": "strong", "two_factor_enabled": false}', '192.168.1.130', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-01-27 16:20:00+00'),
('l50e8400-e29b-41d4-a716-446655440023', 'a50e8400-e29b-41d4-a716-446655440012', 'PASSWORD_CHANGE', 'auth', 'a50e8400-e29b-41d4-a716-446655440012', '{"method": "admin_reset", "strength": "strong", "two_factor_enabled": false}', '192.168.1.145', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-26 11:30:00+00'),

-- Eliminación de datos
('l50e8400-e29b-41d4-a716-446655440024', 'a50e8400-e29b-41d4-a716-446655440003', 'DELETE', 'service_requests', 's50e8400-e29b-41d4-a716-446655440015', '{"reason": "client_cancellation", "original_cost": 4500.00, "refund_issued": false}', '192.168.1.135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-23 11:45:00+00'),

-- Logout de usuarios
('l50e8400-e29b-41d4-a716-446655440025', 'a50e8400-e29b-41d4-a716-446655440009', 'LOGOUT', 'auth', 'a50e8400-e29b-41d4-a716-446655440009', '{"session_duration": "8_hours_45_minutes", "method": "user_initiated"}', '192.168.1.120', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-01-29 17:15:00+00')

ON CONFLICT (id) DO NOTHING;

-- Comentarios finales sobre los datos generados
COMMENT ON TABLE users IS 'Tabla ampliada con 15 usuarios adicionales incluyendo especialistas técnicos y personal operativo';
COMMENT ON TABLE clients IS 'Tabla ampliada con 25 clientes adicionales cubriendo múltiples sectores empresariales';
COMMENT ON TABLE service_requests IS 'Tabla ampliada con 20 solicitudes adicionales mostrando diversos escenarios de servicio';
COMMENT ON TABLE notifications IS 'Tabla ampliada con 20 notificaciones adicionales para diferentes roles y situaciones';
COMMENT ON TABLE audit_logs IS 'Tabla ampliada con 25 registros de auditoría adicionales cubriendo todas las operaciones del sistema';