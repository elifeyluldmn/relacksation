const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  address: {
    line1: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zip: {
      type: String,
      required: true,
      trim: true
    }
  },
  products: [{
    type: String,
    enum: ['sauna', 'cold-plunge', 'fire-pit'],
    required: true
  }],
  startDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  endDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient availability queries
bookingSchema.index({ startDate: 1, endDate: 1, status: 1 });
bookingSchema.index({ products: 1 });

module.exports = mongoose.model('Booking', bookingSchema);