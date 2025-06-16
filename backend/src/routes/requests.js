import express from 'express';
import { body, query } from 'express-validator';
import multer from 'multer';
import path from 'path';

import Request from '../models/Request.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { auditLog } from '../middleware/audit.js';
import { createNotification } from '../services/notificationService.js';
import { validateDateConflicts } from '../services/requestService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Configuración de multer para archivos adjuntos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Obtener lista de solicitudes
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filters = {};
    
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    if (req.query.priority) {
      filters.priority = req.query.priority;
    }
    
    if (req.query.client) {
      filters.client = req.query.client;
    }
    
    if (req.query.assignedTechnician) {
      filters.assignedTechnician = req.query.assignedTechnician;
    }

    // Filtros por rol
    if (req.user.role === 'technician') {
      filters.assignedTechnician = req.user._id;
    } else if (req.user.role === 'operator') {
      filters.requestedBy = req.user._id;
    }

    // Búsqueda por texto
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { requestNumber: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filtros de fecha
    if (req.query.dateFrom || req.query.dateTo) {
      filters.createdAt = {};
      if (req.query.dateFrom) {
        filters.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filters.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    const requests = await Request.find(filters)
      .populate('client', 'name email type')
      .populate('assignedTechnician', 'name email')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(filters);

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Crear nueva solicitud
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  authenticate,
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('type').isIn(['maintenance', 'repair', 'installation', 'inspection', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('client').isMongoId(),
  body('scheduledDate').optional().isISO8601(),
  validateRequest,
  auditLog('create', 'request'),
], async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      requestedBy: req.user._id,
    };

    // Validar conflictos de fecha si se especifica
    if (requestData.scheduledDate) {
      const conflicts = await validateDateConflicts(
        requestData.scheduledDate,
        requestData.assignedTechnician
      );
      
      if (conflicts.length > 0) {
        return res.status(400).json({
          message: 'Conflicto de fechas detectado',
          conflicts,
        });
      }
    }

    const request = new Request(requestData);
    await request.save();

    await request.populate([
      { path: 'client', select: 'name email type' },
      { path: 'requestedBy', select: 'name email' },
    ]);

    // Crear notificación para supervisores/managers
    await createNotification({
      recipients: ['supervisor', 'manager'],
      title: 'Nueva solicitud creada',
      message: `Se ha creado una nueva solicitud: ${request.title}`,
      type: 'request_update',
      relatedEntity: {
        entityType: 'request',
        entityId: request._id,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    logger.error('Error creando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', [
  authenticate,
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('client')
      .populate('assignedTechnician', 'name email profile')
      .populate('requestedBy', 'name email')
      .populate('comments.user', 'name email')
      .populate('approvalHistory.user', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar permisos
    if (req.user.role === 'operator' && request.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    if (req.user.role === 'technician' && request.assignedTechnician?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(request);
  } catch (error) {
    logger.error('Error obteniendo solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/approve:
 *   post:
 *     summary: Aprobar solicitud
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/approve', [
  authenticate,
  authorize('supervisor', 'manager', 'admin'),
  body('comment').optional().trim(),
  body('assignedTechnician').optional().isMongoId(),
  body('scheduledDate').optional().isISO8601(),
  validateRequest,
  auditLog('approve', 'request'),
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Solo se pueden aprobar solicitudes pendientes' });
    }

    // Validar conflictos de fecha si se asigna técnico y fecha
    if (req.body.assignedTechnician && req.body.scheduledDate) {
      const conflicts = await validateDateConflicts(
        req.body.scheduledDate,
        req.body.assignedTechnician,
        request._id
      );
      
      if (conflicts.length > 0) {
        return res.status(400).json({
          message: 'Conflicto de fechas detectado',
          conflicts,
        });
      }
    }

    // Actualizar solicitud
    request.status = 'approved';
    if (req.body.assignedTechnician) {
      request.assignedTechnician = req.body.assignedTechnician;
    }
    if (req.body.scheduledDate) {
      request.scheduledDate = req.body.scheduledDate;
    }

    // Agregar al historial de aprobación
    request.approvalHistory.push({
      action: 'approved',
      user: req.user._id,
      comment: req.body.comment,
    });

    await request.save();

    // Crear notificaciones
    const notifications = [];
    
    // Notificar al solicitante
    notifications.push({
      recipient: request.requestedBy,
      title: 'Solicitud aprobada',
      message: `Tu solicitud "${request.title}" ha sido aprobada`,
      type: 'success',
      relatedEntity: {
        entityType: 'request',
        entityId: request._id,
      },
    });

    // Notificar al técnico asignado
    if (request.assignedTechnician) {
      notifications.push({
        recipient: request.assignedTechnician,
        title: 'Nueva asignación',
        message: `Se te ha asignado la solicitud "${request.title}"`,
        type: 'info',
        relatedEntity: {
          entityType: 'request',
          entityId: request._id,
        },
      });
    }

    await Promise.all(notifications.map(notif => createNotification(notif)));

    await request.populate([
      { path: 'client', select: 'name email type' },
      { path: 'assignedTechnician', select: 'name email' },
      { path: 'requestedBy', select: 'name email' },
    ]);

    res.json(request);
  } catch (error) {
    logger.error('Error aprobando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/reject:
 *   post:
 *     summary: Rechazar solicitud
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reject', [
  authenticate,
  authorize('supervisor', 'manager', 'admin'),
  body('comment').notEmpty().trim(),
  validateRequest,
  auditLog('reject', 'request'),
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Solo se pueden rechazar solicitudes pendientes' });
    }

    request.status = 'rejected';
    request.approvalHistory.push({
      action: 'rejected',
      user: req.user._id,
      comment: req.body.comment,
    });

    await request.save();

    // Notificar al solicitante
    await createNotification({
      recipient: request.requestedBy,
      title: 'Solicitud rechazada',
      message: `Tu solicitud "${request.title}" ha sido rechazada`,
      type: 'warning',
      relatedEntity: {
        entityType: 'request',
        entityId: request._id,
      },
    });

    await request.populate([
      { path: 'client', select: 'name email type' },
      { path: 'requestedBy', select: 'name email' },
    ]);

    res.json(request);
  } catch (error) {
    logger.error('Error rechazando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/comments:
 *   post:
 *     summary: Agregar comentario a solicitud
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/comments', [
  authenticate,
  body('content').notEmpty().trim(),
  validateRequest,
  auditLog('add_comment', 'request'),
], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    request.comments.push({
      user: req.user._id,
      content: req.body.content,
    });

    await request.save();
    await request.populate('comments.user', 'name email');

    res.json(request.comments[request.comments.length - 1]);
  } catch (error) {
    logger.error('Error agregando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/requests/{id}/attachments:
 *   post:
 *     summary: Subir archivo adjunto
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/attachments', [
  authenticate,
  upload.single('file'),
  auditLog('upload_attachment', 'request'),
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó archivo' });
    }

    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    };

    request.attachments.push(attachment);
    await request.save();

    res.json(attachment);
  } catch (error) {
    logger.error('Error subiendo archivo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;