# Sistema de Gestión de Servicios - Inmel Chile

## Descripción del Proyecto

Sistema web integral para la gestión optimizada de solicitudes de servicio en Inmel Chile. La plataforma automatiza procesos clave como validación de fechas, asignación de recursos y generación de reportes, con el objetivo de reducir en un 30% el tiempo de gestión y mejorar la toma de decisiones.

## Características Principales

- 🔐 **Autenticación Segura**: Sistema de login con autenticación de dos factores (2FA)
- 👥 **Gestión de Usuarios**: Administración completa de usuarios con roles diferenciados
- 📋 **Solicitudes de Servicio**: Creación, seguimiento y gestión de solicitudes
- 👨‍🔧 **Gestión de Técnicos**: Asignación y seguimiento de técnicos
- 🏢 **Gestión de Clientes**: Administración de información de clientes
- 📊 **Reportes y Auditoría**: Generación de reportes y logs de auditoría
- 🔔 **Notificaciones**: Sistema de notificaciones en tiempo real
- 📱 **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- ♿ **Accesibilidad**: Navegación por teclado y características de accesibilidad

## Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos
- **Radix UI** para componentes accesibles
- **React Hook Form** para manejo de formularios
- **React Query (TanStack Query)** para gestión de estado del servidor
- **React Router** para navegación

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** como base de datos principal
- **Row Level Security (RLS)** para seguridad de datos

### Herramientas de Desarrollo
- **TypeScript** para tipado estático
- **ESLint** para linting
- **PostCSS** para procesamiento de CSS
- **Lovable Tagger** para análisis de código

## Instalación

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun
- Cuenta de Supabase

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd sistema-gestion-servicios
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con las credenciales de Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Configurar la base de datos**
```bash
# Las migraciones se encuentran en supabase/migrations/
# Aplicar migraciones en Supabase Dashboard o CLI
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── accessibility/   # Componentes de accesibilidad
│   ├── auth/           # Componentes de autenticación
│   ├── clients/        # Componentes de gestión de clientes
│   ├── layout/         # Componentes de layout
│   ├── requests/       # Componentes de solicitudes
│   ├── technicians/    # Componentes de técnicos
│   ├── ui/            # Componentes base de UI
│   └── users/         # Componentes de usuarios
├── contexts/           # Contextos de React
├── hooks/             # Hooks personalizados
├── lib/               # Utilidades y configuraciones
├── pages/             # Páginas principales
├── services/          # Servicios de API
├── styles/            # Estilos globales
└── types/             # Definiciones de tipos TypeScript
```

## Uso

### Autenticación
1. Acceder a `/login`
2. Ingresar credenciales
3. Completar autenticación de dos factores si está habilitada

### Gestión de Solicitudes
1. Navegar a "Solicitudes de Servicio"
2. Crear nueva solicitud con el botón "+"
3. Completar formulario con detalles del servicio
4. Asignar técnico y establecer prioridad
5. Hacer seguimiento del estado

### Administración de Usuarios
1. Acceder a "Gestión de Usuarios" (solo administradores)
2. Crear, editar o desactivar usuarios
3. Asignar roles: admin, manager, supervisor, technician, operator

## Roles y Permisos

- **Admin**: Acceso completo al sistema
- **Manager**: Gestión de usuarios, clientes y solicitudes
- **Supervisor**: Gestión de solicitudes y técnicos
- **Technician**: Actualización de solicitudes asignadas
- **Operator**: Visualización de solicitudes

## Base de Datos

### Tablas Principales
- `users`: Información de usuarios y autenticación
- `clients`: Datos de clientes (individuales y empresas)
- `service_requests`: Solicitudes de servicio
- `notifications`: Sistema de notificaciones
- `audit_logs`: Registro de auditoría

### Seguridad
- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso basadas en roles
- Encriptación de datos sensibles

## Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Realizar cambios y commits
4. Ejecutar tests y linting
5. Crear Pull Request

### Estándares de Código
- Usar TypeScript para tipado estático
- Seguir convenciones de ESLint
- Documentar componentes complejos
- Escribir tests para nuevas funcionalidades

## Despliegue

### Construcción para Producción
```bash
npm run build
```

### Variables de Entorno de Producción
- Configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Asegurar configuración correcta de RLS en Supabase

## Soporte y Mantenimiento

### Logs y Monitoreo
- Logs de auditoría disponibles en la tabla `audit_logs`
- Monitoreo de rendimiento a través de React Query DevTools

### Backup y Recuperación
- Backups automáticos de Supabase
- Scripts de migración versionados

## Licencia

[Especificar licencia del proyecto]

## Contacto

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Mantenido por**: Equipo de Desarrollo Inmel Chile