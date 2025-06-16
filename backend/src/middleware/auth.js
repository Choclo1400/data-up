import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No autorizado para esta acción' });
    }

    next();
  };
};

export const requireTwoFactor = async (req, res, next) => {
  try {
    if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
      return res.status(403).json({ 
        message: 'Verificación de dos factores requerida',
        requiresTwoFactor: true 
      });
    }
    next();
  } catch (error) {
    logger.error('Error en verificación 2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};