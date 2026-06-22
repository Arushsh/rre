const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true
  },
  razorpay_payment_id: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpay_signature: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true // in paise
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created'
  },
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  notes: Object
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);