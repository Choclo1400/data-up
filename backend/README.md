# Backend - Sistema de Gestión de Servicios Técnicos

## Descripción
Backend RESTful para el sistema de gestión de servicios técnicos, desarrollado con Node.js, Express.js y MongoDB.

## Características Principales

### 🔐 Autenticación y Seguridad
- Autenticación JWT con roles
- Autenticación de dos factores (2FA)
- Control de acceso basado en roles
- Rate limiting y protección contra ataques
- Encriptación de contraseñas con bcrypt

### 📋 Gestión de Solicitudes
- CRUD completo de solicitudes
- Sistema de estados y flujo de aprobación
- Validación automática de conflictos de fechas
- Comentarios y archivos adjuntos
- Historial completo de cambios

### 👥 Gestión de Usuarios
- Roles: admin, manager, supervisor, technician, operator
- Perfiles de usuario personalizables
- Control de sesiones y bloqueo de cuentas

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Filtrado por tipo y estado
- Marcado de leído/no leído

### 📊 Reportes y Métricas
- Generación de reportes personalizados
- Exportación a CSV/PDF
- Métricas de rendimiento y KPIs
- Dashboard de estadísticas

### 🔍 Auditoría Completa
- Log de todas las acciones críticas
- Trazabilidad de cambios
- Registro de accesos y errores

### 💾 Backup y Restauración
- Backups automáticos programados
- Restauración de datos
- Historial de backups

### 📥 Importación de Datos
- Importación desde Excel/CSV
- Validación de datos
- Reporte de errores de importación

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Crear directorios necesarios**
```bash
mkdir -p logs uploads backups
```

5. **Iniciar MongoDB**
```bash
# Asegúrate de que MongoDB esté ejecutándose
mongod
```

6. **Ejecutar en desarrollo**
```bash
npm run dev
```

## Configuración

### Variables de Entorno (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gestion_servicios
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
TWO_FACTOR_SECRET=tu_2fa_secret_aqui
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
BACKUP_PATH=backups/
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verify-2fa` - Verificar código 2FA
- `POST /api/auth/setup-2fa` - Configurar 2FA
- `GET /api/auth/me` - Información del usuario actual

### Solicitudes
- `GET /api/requests` - Listar solicitudes
- `POST /api/requests` - Crear solicitud
- `GET /api/requests/:id` - Obtener solicitud
- `PUT /api/requests/:id` - Actualizar solicitud
- `POST /api/requests/:id/approve` - Aprobar solicitud
- `POST /api/requests/:id/reject` - Rechazar solicitud
- `POST /api/requests/:id/comments` - Agregar comentario
- `POST /api/requests/:id/attachments` - Subir archivo

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/:id/read` - Marcar como leída
- `GET /api/notifications/unread-count` - Contador no leídas

### Reportes
- `GET /api/reports/requests` - Reporte de solicitudes
- `GET /api/reports/export` - Exportar datos

### Auditoría
- `GET /api/audit/logs` - Logs de auditoría
- `GET /api/audit/user-activity` - Actividad de usuario

### Backup
- `POST /api/backup/create` - Crear backup
- `GET /api/backup/list` - Listar backups
- `POST /api/backup/restore` - Restaurar backup

### Importación
- `POST /api/import/excel` - Importar desde Excel
- `POST /api/import/csv` - Importar desde CSV

### Métricas
- `GET /api/metrics/dashboard` - Métricas del dashboard
- `GET /api/metrics/performance` - Métricas de rendimiento

## Documentación API

La documentación completa de la API está disponible en:
```
http://localhost:5000/api-docs
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middlewares
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios de negocio
│   ├── utils/           # Utilidades
│   └── server.js        # Servidor principal
├── logs/                # Archivos de log
├── uploads/             # Archivos subidos
├── backups/             # Backups de la BD
├── tests/               # Pruebas
└── package.json
```

## Roles y Permisos

### Admin
- Acceso completo al sistema
- Gestión de usuarios y roles
- Configuración del sistema
- Backups y restauración

### Manager
- Aprobación/rechazo de solicitudes
- Gestión de técnicos
- Reportes avanzados
- Métricas del sistema

### Supervisor
- Aprobación de solicitudes de su área
- Asignación de técnicos
- Seguimiento de solicitudes

### Technician
- Ver solicitudes asignadas
- Actualizar estado de trabajos
- Agregar comentarios y archivos

### Operator
- Crear solicitudes
- Ver sus propias solicitudes
- Agregar comentarios

## Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch
```

## Seguridad

- Todas las contraseñas se hashean con bcrypt
- JWT para autenticación stateless
- Rate limiting para prevenir ataques
- Validación de entrada en todos los endpoints
- Logs de auditoría para acciones críticas
- CORS configurado para el frontend

## Monitoreo

- Logs estructurados con Winston
- Métricas de rendimiento
- Health check endpoint: `/health`
- Auditoría completa de acciones

## Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License