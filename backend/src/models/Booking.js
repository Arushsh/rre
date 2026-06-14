const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  guestCount: {
    type: Number,
  },
  additionalNotes: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true, // in paise
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  
  // OTP Fields
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to generate unique booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const now = new Date();
    this.bookingId = `RRE-${now.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);