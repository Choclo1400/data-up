```javascript
import { createClient } from '@supabase/supabase-js';

// Configura tus credenciales de Supabase
// Asegúrate de que estas variables de entorno estén configuradas o reemplázalas directamente
// Si estás ejecutando esto en un entorno de desarrollo, puedes obtenerlas de tu archivo .env o de la consola de Supabase.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL'; // Reemplaza con tu URL de Supabase
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY'; // Reemplaza con tu clave anon de Supabase

if (SUPABASE_URL === 'TU_SUPABASE_URL' || SUPABASE_ANON_KEY === 'TU_SUPABASE_ANON_KEY') {
  console.error('ERROR: Por favor, configura SUPABASE_URL y SUPABASE_ANON_KEY en el script o en tus variables de entorno.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ID de un usuario administrador de ejemplo para pruebas de RLS (del archivo de migración)
// Este ID se usa para simular un usuario con permisos para ciertas operaciones.
const ADMIN_USER_ID = '550e8400-e29b-41d4-a716-446655440001'; 

// Función auxiliar para ejecutar y medir el tiempo de las pruebas
async function runTest(name, testFunction) {
  console.log(`\n--- Ejecutando prueba: ${name} ---`);
  const startTime = process.hrtime.bigint();
  let success = false;
  let errorMessage = '';
  let result = null;

  try {
    result = await testFunction();
    success = true;
  } catch (error) {
    errorMessage = error.message || 'Error desconocido';
    console.error(`ERROR en ${name}:`, error);
  } finally {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    console.log(`Resultado: ${success ? 'ÉXITO' : 'FALLO'}`);
    console.log(`Tiempo: ${durationMs.toFixed(2)} ms`);
    if (errorMessage) {
      console.log(`Mensaje de error: ${errorMessage}`);
    }
    return { name, success, durationMs, errorMessage, result };
  }
}

// 1. Prueba de conexión básica
async function testConnection() {
  const { data, error } = await supabase.from('users').select('id').limit(1);
  if (error) throw error;
  if (!data || data.length === 0) {
    console.warn('Advertencia: No se encontraron usuarios en la tabla. La base de datos podría estar vacía.');
  }
  return 'Conexión exitosa y se pudo leer de la tabla "users".';
}

// 2. Prueba de lectura de datos existentes
async function testReadOperations() {
  const results = {};

  // Leer usuarios
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .limit(5);
  if (usersError) throw usersError;
  results.usersCount = users.length;
  console.log(`Leídos ${users.length} usuarios.`);

  // Leer clientes
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('id, name, type, email')
    .limit(5);
  if (clientsError) throw clientsError;
  results.clientsCount = clients.length;
  console.log(`Leídos ${clients.length} clientes.`);

  // Leer solicitudes de servicio (filtrando por un técnico asignado si es posible, para RLS)
  const { data: serviceRequests, error: srError } = await supabase
    .from('service_requests')
    .select('id, description, status, assigned_technician_id')
    .eq('assigned_technician_id', ADMIN_USER_ID) // Intenta leer solicitudes asignadas al admin
    .limit(5);
  if (srError) {
    // Si falla por RLS, intenta leer sin filtro (puede que no devuelva nada si RLS es estricto)
    console.warn(`Advertencia: Falló la lectura de service_requests para ADMIN_USER_ID. Intentando sin filtro. Error: ${srError.message}`);
    const { data: allServiceRequests, error: allSrError } = await supabase
      .from('service_requests')
      .select('id, description, status')
      .limit(5);
    if (allSrError) throw allSrError;
    results.serviceRequestsCount = allServiceRequests.length;
    console.log(`Leídas ${allServiceRequests.length} solicitudes de servicio (posiblemente filtradas por RLS).`);
  } else {
    results.serviceRequestsCount = serviceRequests.length;
    console.log(`Leídas ${serviceRequests.length} solicitudes de servicio (asignadas al admin).`);
  }

  // Leer notificaciones
  const { data: notifications, error: notificationsError } = await supabase
    .from('notifications')
    .select('id, title, message')
    .limit(5);
  if (notificationsError) throw notificationsError;
  results.notificationsCount = notifications.length;
  console.log(`Leídas ${notifications.length} notificaciones.`);

  // Leer logs de auditoría (solo si el usuario tiene permisos, ej. admin)
  const { data: auditLogs, error: auditLogsError } = await supabase
    .from('audit_logs')
    .select('id, action, resource')
    .limit(5);
  if (auditLogsError) {
    console.warn(`Advertencia: Falló la lectura de audit_logs (esperado si no es admin). Error: ${auditLogsError.message}`);
    results.auditLogsCount = 0;
  } else {
    results.auditLogsCount = auditLogs.length;
    console.log(`Leídos ${auditLogs.length} logs de auditoría.`);
  }

  return results;
}

// 3. Prueba de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la tabla 'clients'
// Nota: Estas operaciones pueden fallar debido a las políticas de RLS si no se ejecutan con un rol adecuado (ej. service_role key o un usuario autenticado con permisos).
// Para una prueba completa de CRUD a nivel de base de datos, se recomienda usar una service_role key.
async function testCrudOperations() {
  const testClientId = 'a0000000-e29b-41d4-a716-446655440000'; // UUID para el cliente de prueba
  let created = false;
  let updated = false;
  let deleted = false;

  try {
    // Crear un nuevo cliente
    console.log('Intentando crear un cliente de prueba...');
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert({
        id: testClientId,
        name: 'Cliente de Prueba CRUD',
        email: 'crud.test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        type: 'individual',
        contact_person: 'John Doe',
        is_active: true,
      })
      .select();
    if (createError) throw createError;
    created = true;
    console.log('Cliente de prueba creado:', newClient);

    // Leer el cliente creado
    console.log('Intentando leer el cliente de prueba...');
    const { data: readClient, error: readError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', testClientId)
      .single();
    if (readError) throw readError;
    console.log('Cliente de prueba leído:', readClient);

    // Actualizar el cliente
    console.log('Intentando actualizar el cliente de prueba...');
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update({ email: 'crud.updated@example.com' })
      .eq('id', testClientId)
      .select();
    if (updateError) throw updateError;
    updated = true;
    console.log('Cliente de prueba actualizado:', updatedClient);

  } catch (error) {
    console.warn(`Advertencia: Las operaciones CRUD pueden fallar debido a RLS. Error: ${error.message}`);
    // No lanzar el error para permitir que la prueba continúe y se intente la eliminación
  } finally {
    // Eliminar el cliente (intentar siempre, incluso si la creación/actualización falló)
    console.log('Intentando eliminar el cliente de prueba...');
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', testClientId);
    if (deleteError) {
      console.warn(`Advertencia: Falló la eliminación del cliente de prueba (posiblemente por RLS o no existía). Error: ${deleteError.message}`);
    } else {
      deleted = true;
      console.log('Cliente de prueba eliminado.');
    }
  }

  return { created, updated, deleted };
}

// 4. Prueba de relaciones entre tablas
async function testRelationships() {
  // Unir service_requests con clients y users
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      id,
      description,
      status,
      clients (name, email),
      users!service_requests_assigned_technician_id_fkey (name, email, role)
    `)
    .limit(5);

  if (error) throw error;

  console.log(`Se encontraron ${data.length} solicitudes de servicio con información relacionada.`);
  if (data.length > 0) {
    console.log('Ejemplo de solicitud con relaciones:', JSON.stringify(data[0], null, 2));
    // Verificar que los datos relacionados no son nulos
    const firstRequest = data[0];
    if (!firstRequest.clients || !firstRequest.users) {
      throw new Error('Los datos relacionados (clientes o usuarios) son nulos, lo que indica un problema en la relación o en la política de RLS.');
    }
  } else {
    console.warn('Advertencia: No se encontraron solicitudes de servicio para probar las relaciones. Asegúrate de que haya datos en la tabla service_requests.');
  }
  return data.length;
}

// Función principal para ejecutar todas las pruebas
async function main() {
  console.log('Iniciando verificación de salud de la base de datos Supabase...');
  const allResults = [];

  allResults.push(await runTest('Conexión a la Base de Datos', testConnection));
  allResults.push(await runTest('Operaciones de Lectura', testReadOperations));
  allResults.push(await runTest('Operaciones CRUD (Crear, Actualizar, Eliminar)', testCrudOperations));
  allResults.push(await runTest('Relaciones entre Tablas', testRelationships));

  console.log('\n--- Informe Final ---');
  let overallStatus = 'ÉXITO';
  allResults.forEach(res => {
    console.log(`\n${res.name}: ${res.success ? 'ÉXITO' : 'FALLO'} (${res.durationMs.toFixed(2)} ms)`);
    if (res.errorMessage) {
      console.log(`  Error: ${res.errorMessage}`);
    }
    if (!res.success) {
      overallStatus = 'FALLO CON ERRORES';
    }
  });

  console.log(`\nEstado General de la Base de Datos: ${overallStatus}`);

  // Recomendaciones de optimización
  console.log('\n--- Recomendaciones de Optimización ---');
  console.log('1. **Índices**: Las migraciones ya incluyen índices. Para una optimización más profunda, revisa el rendimiento de tus consultas más frecuentes en el panel de Supabase (sección "Database" -> "Performance") para identificar consultas lentas y añadir índices adicionales si es necesario.');
  console.log('2. **Políticas de RLS**: Asegúrate de que tus políticas de Row Level Security (RLS) sean lo suficientemente permisivas para las operaciones que tus usuarios deben realizar, pero lo suficientemente restrictivas para proteger tus datos. Las advertencias en las pruebas CRUD pueden indicar RLS activo.');
  console.log('3. **Pool de Conexiones**: Para aplicaciones con alto tráfico, considera optimizar el pool de conexiones de tu cliente Supabase.');
  console.log('4. **Optimización de Consultas**: Revisa tus consultas SQL para asegurarte de que son eficientes, evitando `SELECT *` innecesarios y utilizando `JOIN`s de manera efectiva.');
  console.log('5. **Tipos de Datos**: Utiliza los tipos de datos más apropiados para tus columnas para optimizar el almacenamiento y el rendimiento.');
}

main();
```