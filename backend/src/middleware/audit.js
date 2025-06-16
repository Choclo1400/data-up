import AuditLog from '../models/AuditLog.js';
import logger from '../utils/logger.js';

export const auditLog = (action, entity) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Capturar la respuesta
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Crear log de auditoría
      const auditData = {
        user: req.user?._id,
        action,
        entity,
        entityId: req.params.id || responseData?._id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        success: res.statusCode < 400,
        metadata: {
          method: req.method,
          url: req.originalUrl,
          body: req.method !== 'GET' ? req.body : undefined,
        },
      };

      if (res.statusCode >= 400) {
        auditData.errorMessage = responseData?.message || 'Error desconocido';
      }

      AuditLog.create(auditData).catch(err => {
        logger.error('Error creando log de auditoría:', err);
      });

      originalSend.call(this, data);
    };

    next();
  };
};