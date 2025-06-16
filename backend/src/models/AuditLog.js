import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: String,
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Índices
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entity: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);