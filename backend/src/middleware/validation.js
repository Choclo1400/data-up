import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Errores de validación:', errors.array());
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array(),
    });
  }
  
  next();
};

export const sanitizeInput = (req, res, next) => {
  // Sanitizar inputs básicos
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};