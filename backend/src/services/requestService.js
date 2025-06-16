import Request from '../models/Request.js';
import logger from '../utils/logger.js';

export const validateDateConflicts = async (scheduledDate, technicianId, excludeRequestId = null) => {
  try {
    if (!scheduledDate || !technicianId) {
      return [];
    }

    const date = new Date(scheduledDate);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const filter = {
      assignedTechnician: technicianId,
      scheduledDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $in: ['approved', 'in_progress'] },
    };

    if (excludeRequestId) {
      filter._id = { $ne: excludeRequestId };
    }

    const conflicts = await Request.find(filter)
      .populate('client', 'name')
      .select('requestNumber title scheduledDate client');

    return conflicts;
  } catch (error) {
    logger.error('Error validando conflictos de fecha:', error);
    throw error;
  }
};

export const getRequestMetrics = async (filters = {}) => {
  try {
    const pipeline = [
      { $match: filters },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          avgProcessingTime: {
            $avg: {
              $cond: [
                { $ne: ['$completedDate', null] },
                { $subtract: ['$completedDate', '$createdAt'] },
                null
              ]
            }
          },
        }
      }
    ];

    const result = await Request.aggregate(pipeline);
    return result[0] || {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      avgProcessingTime: 0,
    };
  } catch (error) {
    logger.error('Error obteniendo métricas de solicitudes:', error);
    throw error;
  }
};