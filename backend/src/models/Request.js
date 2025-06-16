import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
  },
  type: {
    type: String,
    enum: ['maintenance', 'repair', 'installation', 'inspection', 'other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'draft',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  estimatedHours: {
    type: Number,
    min: 0,
  },
  actualHours: {
    type: Number,
    min: 0,
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  approvalHistory: [{
    action: {
      type: String,
      enum: ['approved', 'rejected', 'requested_changes'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  tags: [String],
  cost: {
    estimated: Number,
    actual: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
}, {
  timestamps: true,
});

// Índices
requestSchema.index({ requestNumber: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ client: 1 });
requestSchema.index({ assignedTechnician: 1 });
requestSchema.index({ scheduledDate: 1 });
requestSchema.index({ createdAt: -1 });

// Middleware para generar número de solicitud
requestSchema.pre('save', async function(next) {
  if (!this.requestNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.requestNumber = `REQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Request', requestSchema);