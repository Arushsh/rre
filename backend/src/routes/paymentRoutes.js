const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Gallery = require('../models/Gallery');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create an order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, galleryId, userId, customerName, customerEmail, customerPhone } = req.body;

    // Validate gallery and user
    const gallery = await Gallery.findById(galleryId);
    const user = await User.findById(userId);
    
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        galleryId: galleryId.toString(),
        userId: userId.toString(),
        customerName,
        customerEmail
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment to DB
    const payment = new Payment({
      razorpay_order_id: order.id,
      amount: amount * 100,
      gallery: galleryId,
      user: userId,
      customerName,
      customerEmail,
      customerPhone
    });

    await payment.save();

    res.json({
      success: true,
      order: order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      // Update payment status
      const payment = await Payment.findOne({ razorpay_order_id });
      if (payment) {
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature = razorpay_signature;
        payment.status = 'paid';
        await payment.save();
      }

      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Mark as failed
      const payment = await Payment.findOne({ razorpay_order_id });
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all payments (admin)
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('gallery').populate('user').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get payments for a specific gallery
router.get('/gallery/:galleryId', async (req, res) => {
  try {
    const payments = await Payment.find({ gallery: req.params.galleryId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get payment by order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ razorpay_order_id: req.params.orderId }).populate('gallery').populate('user');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;