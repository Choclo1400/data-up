import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const createNotification = async (notificationData) => {
  try {
    const { recipients, recipient, ...data } = notificationData;
    
    if (recipients) {
      // Crear notificaciones para múltiples destinatarios por rol
      const users = await User.find({ 
        role: { $in: recipients },
        isActive: true 
      });
      
      const notifications = users.map(user => ({
        recipient: user._id,
        ...data,
      }));
      
      return await Notification.insertMany(notifications);
    } else if (recipient) {
      // Crear notificación para un destinatario específico
      const notification = new Notification({
        recipient,
        ...data,
      });
      
      return await notification.save();
    }
  } catch (error) {
    logger.error('Error creando notificación:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { 
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    logger.error('Error marcando notificación como leída:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;
    
    const filter = { recipient: userId };
    if (unreadOnly) {
      filter.isRead = false;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedEntity.entityId');
    
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
    
    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  } catch (error) {
    logger.error('Error obteniendo notificaciones:', error);
    throw error;
  }
};