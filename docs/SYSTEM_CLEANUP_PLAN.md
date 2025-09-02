# Plan de Limpieza de Datos de Prueba del Sistema
## Sistema de Gestión de Servicios Técnicos

**Fecha de Creación:** 29 de Diciembre, 2024  
**Versión:** 1.0  
**Responsable:** Administrador de Sistemas  
**Entorno Objetivo:** Producción

---

## 📋 DEFINICIÓN DEL ALCANCE

### Tipo de Sistema
- **Aplicación Web:** React + TypeScript + Supabase
- **Base de Datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth
- **Entorno:** Producción

### Elementos de Prueba Identificados
1. **Componente de Prueba de Notificaciones** (`NotificationTest.tsx`)
2. **Datos de ejemplo en base de datos** (usuarios, clientes, solicitudes)
3. **Configuraciones de desarrollo**
4. **Archivos de documentación de pruebas**

---

## 🎯 INVENTARIO DE DATOS DE PRUEBA

### 1. Componentes de Prueba
- ✅ `src/components/layout/NotificationTest.tsx` - Componente para crear notificaciones de prueba
- ✅ Integración en página de Settings

### 2. Datos de Base de Datos (Migración 20250629082728_wooden_marsh.sql)
- ✅ **13 usuarios de prueba** con emails @techservice.com
- ✅ **10 clientes de ejemplo** (individuales y empresas)
- ✅ **12 solicitudes de servicio** con datos ficticios
- ✅ **7 notificaciones de ejemplo**
- ✅ **10 registros de auditoría** de prueba

### 3. Datos Adicionales (Migración 20250629083317_rough_breeze.sql)
- ✅ **20 clientes adicionales** con datos incompletos para testing
- ✅ Escenarios de validación de datos faltantes

### 4. Archivos de Configuración de Desarrollo
- ✅ Scripts de verificación de salud de BD
- ✅ Documentación de migración
- ✅ Reportes de auditoría

---

## 🛡️ MEDIDAS DE SEGURIDAD

### Pre-Limpieza
1. **Backup Completo del Sistema**
   ```bash
   # Backup de base de datos Supabase
   pg_dump $DATABASE_URL > backup_pre_cleanup_$(date +%Y%m%d_%H%M%S).sql
   
   # Backup de código fuente
   git tag v1.0-pre-cleanup
   git push origin v1.0-pre-cleanup
   ```

2. **Documentación del Estado Actual**
   - Inventario completo de usuarios activos
   - Lista de clientes reales vs. de prueba
   - Solicitudes de servicio legítimas

3. **Identificación de Dependencias**
   - Verificar que no hay referencias a datos de prueba en producción
   - Confirmar que usuarios reales no dependen de datos de ejemplo

### Plan de Rollback
```sql
-- En caso de necesitar restaurar
\i backup_pre_cleanup_YYYYMMDD_HHMMSS.sql
```

---

## 🗑️ PROCESO DE ELIMINACIÓN

### FASE 1: Limpieza de Componentes de Prueba (Prioridad: ALTA)

#### Paso 1.1: Remover Componente de Prueba de Notificaciones
```typescript
// Eliminar de src/pages/Settings.tsx
// Remover import y sección de pruebas
```

#### Paso 1.2: Eliminar Archivo de Prueba
```bash
rm src/components/layout/NotificationTest.tsx
```

### FASE 2: Limpieza de Base de Datos (Prioridad: CRÍTICA)

⚠️ **RESTRICCIÓN IDENTIFICADA**: Las migraciones existentes no pueden ser modificadas según las restricciones del proyecto.

#### Estrategia Alternativa: Nueva Migración de Limpieza
```sql
-- Crear nueva migración: cleanup_test_data.sql
-- Eliminar datos de prueba manteniendo estructura
DELETE FROM audit_logs WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@techservice.com');
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@techservice.com');
DELETE FROM service_requests WHERE client_id IN (SELECT id FROM clients WHERE name LIKE '%Tecnologías Avanzadas%');
-- ... más comandos de limpieza
```

### FASE 3: Limpieza de Archivos de Desarrollo

#### Paso 3.1: Remover Scripts de Desarrollo
```bash
rm scripts/db_health_check.js
rm docs/migration-plan.md
rm AUDIT_REPORT.md
```

#### Paso 3.2: Limpiar Documentación de Desarrollo
```bash
rm -rf .bolt/supabase_discarded_migrations/
```

---

## ✅ VALIDACIÓN POST-LIMPIEZA

### 1. Verificación de Funcionalidad
- [ ] Login con usuarios reales funciona
- [ ] Creación de clientes reales funciona
- [ ] Sistema de notificaciones funciona sin componente de prueba
- [ ] Reportes se generan correctamente
- [ ] Auditoría registra eventos correctamente

### 2. Verificación de Datos
```sql
-- Verificar que no quedan datos de prueba
SELECT COUNT(*) FROM users WHERE email LIKE '%@techservice.com';
SELECT COUNT(*) FROM clients WHERE name LIKE '%Tecnologías Avanzadas%';
SELECT COUNT(*) FROM service_requests WHERE description LIKE '%prueba%';
```

### 3. Verificación de Rendimiento
- [ ] Tiempo de carga de páginas < 2 segundos
- [ ] Consultas de base de datos optimizadas
- [ ] Bundle size reducido

---

## 📊 MÉTRICAS DE LIMPIEZA

### Antes de la Limpieza
- **Usuarios en BD:** ~13 (todos de prueba)
- **Clientes en BD:** ~30 (todos de prueba)
- **Solicitudes:** ~12 (todas de prueba)
- **Archivos de código:** 1 componente de prueba
- **Scripts:** 1 script de verificación

### Después de la Limpieza
- **Usuarios en BD:** 0 (solo usuarios reales de producción)
- **Clientes en BD:** 0 (solo clientes reales)
- **Solicitudes:** 0 (solo solicitudes reales)
- **Archivos de código:** Componente de prueba eliminado
- **Scripts:** Scripts de desarrollo removidos

---

## 🚀 NUEVA ESTRUCTURA OPTIMIZADA

```
src/
├── components/
│   ├── features/           # Componentes por dominio
│   │   ├── auth/          # Autenticación
│   │   ├── users/         # Gestión de usuarios
│   │   ├── clients/       # Gestión de clientes
│   │   ├── requests/      # Solicitudes de servicio
│   │   └── technicians/   # Gestión de técnicos
│   ├── layout/            # Componentes de layout
│   ├── shared/            # Componentes compartidos
│   │   ├── accessibility/ # Accesibilidad
│   │   └── theme/         # Tema y modo oscuro
│   └── ui/                # Componentes base UI
├── hooks/
│   ├── data/              # Hooks de datos
│   └── ui/                # Hooks de interfaz
├── services/
│   ├── api/               # Servicios de API
│   └── database/          # Servicios de base de datos
├── pages/                 # Páginas de la aplicación
├── types/                 # Definiciones de tipos
└── lib/                   # Utilidades y configuración
```

---

## 📝 BUENAS PRÁCTICAS IMPLEMENTADAS

### 1. Separación de Responsabilidades
- **Features**: Componentes agrupados por dominio de negocio
- **Shared**: Componentes reutilizables entre features
- **UI**: Componentes base sin lógica de negocio

### 2. Convenciones de Nomenclatura
- **PascalCase**: Componentes React
- **camelCase**: Funciones y variables
- **kebab-case**: Archivos y directorios
- **UPPER_CASE**: Constantes

### 3. Gestión de Dependencias
- **Barrel Exports**: Imports más limpios
- **Tree Shaking**: Optimización automática
- **Code Splitting**: Chunks manuales por feature

### 4. Optimización de Bundle
- **Manual Chunks**: Separación por vendor y features
- **Bundle Analyzer**: Herramienta de análisis incluida
- **Lazy Loading**: Preparado para implementar

---

## ⚠️ CONSIDERACIONES ESPECIALES

### Restricciones del Proyecto
- **No modificar migraciones existentes**: Crear nueva migración para limpieza
- **Mantener estructura de RLS**: No alterar políticas de seguridad
- **Preservar funcionalidad**: Solo remover elementos de prueba

### Recomendaciones Post-Limpieza
1. **Implementar CI/CD** para evitar datos de prueba en producción
2. **Crear entorno de staging** separado para pruebas
3. **Establecer políticas** de gestión de datos de prueba
4. **Monitoreo continuo** del tamaño de base de datos

---

## 📅 CRONOGRAMA DE EJECUCIÓN

### Fase 1: Preparación (30 minutos)
- [ ] Crear backups completos
- [ ] Documentar estado actual
- [ ] Verificar usuarios activos reales

### Fase 2: Limpieza de Código (15 minutos)
- [ ] Remover componente NotificationTest
- [ ] Actualizar imports en Settings
- [ ] Eliminar archivos de desarrollo

### Fase 3: Limpieza de Base de Datos (45 minutos)
- [ ] Crear migración de limpieza
- [ ] Ejecutar eliminación de datos de prueba
- [ ] Verificar integridad referencial

### Fase 4: Validación (30 minutos)
- [ ] Pruebas de funcionalidad
- [ ] Verificación de rendimiento
- [ ] Confirmación de limpieza completa

**Tiempo Total Estimado:** 2 horas

---

## 🎯 RESULTADOS ESPERADOS

### Beneficios Inmediatos
- **Reducción del tamaño de BD**: ~80% menos registros
- **Mejor rendimiento**: Consultas más rápidas
- **Código más limpio**: Sin componentes de prueba
- **Seguridad mejorada**: Sin usuarios de prueba

### Beneficios a Largo Plazo
- **Mantenimiento simplificado**: Estructura más clara
- **Escalabilidad mejorada**: Base sólida para crecimiento
- **Debugging facilitado**: Menos ruido en logs y datos

---

## 📞 CONTACTOS DE EMERGENCIA

En caso de problemas durante la limpieza:
1. **Administrador de BD**: Acceso a backups y restauración
2. **Desarrollador Principal**: Conocimiento de dependencias de código
3. **Usuario Final**: Validación de funcionalidad post-limpieza

---

**Estado del Plan:** ✅ LISTO PARA EJECUCIÓN  
**Próximo Paso:** Solicitar autorización para proceder con la limpieza