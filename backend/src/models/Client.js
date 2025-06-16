import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del cliente es requerido'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['individual', 'company', 'government', 'nonprofit'],
    required: true,
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'México',
    },
  },
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: String,
  tags: [String],
  serviceHistory: [{
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
    },
    date: Date,
    type: String,
    status: String,
  }],
}, {
  timestamps: true,
});

// Índices
clientSchema.index({ name: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ type: 1 });

export default mongoose.model('Client', clientSchema);