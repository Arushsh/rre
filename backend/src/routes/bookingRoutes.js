const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Function to send OTP email
const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: '"Rajat Raj Entertainment" <noreply@rajatrajentertainment.com>',
    to: email,
    subject: 'Your OTP for Booking Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f472b6, #db2777); padding: 20px; border-radius: 10px;">
          <h2 style="color: white; text-align: center;">Rajat Raj Entertainment</h2>
        </div>
        <div style="padding: 30px; background: white;">
          <h3 style="color: #333;">Hi ${name},</h3>
          <p style="color: #555;">Your OTP for booking verification is:</p>
          <div style="background: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="font-size: 48px; letter-spacing: 10px; margin: 0; color: #0f172a;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

// 1. Create a new booking and send OTP
router.post('/', async (req, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone, serviceId, eventDate, eventTime, eventLocation, guestCount, additionalNotes, totalAmount } = req.body;

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create booking
    const booking = new Booking({
      customerName,
      customerEmail,
      customerPhone,
      service: serviceId,
      eventDate,
      eventTime,
      eventLocation,
      guestCount,
      additionalNotes,
      totalAmount: totalAmount * 100, // store in paise, but don't create Razorpay order yet
      otp,
      otpExpiry,
      isVerified: false
    });

    await booking.save();
    await booking.populate('service');

    // Send OTP email
    const emailSent = await sendOTPEmail(customerEmail, customerName, otp);
    
    if (!emailSent) {
      console.warn('Email failed to send, but booking created');
    }

    res.json({
      success: true,
      booking,
      message: 'Booking created. OTP sent to your email!'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Resend OTP
router.post('/:bookingId/resend-otp', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    booking.otp = otp;
    booking.otpExpiry = otpExpiry;
    await booking.save();

    // Send new OTP email
    const emailSent = await sendOTPEmail(booking.customerEmail, booking.customerName, otp);
    
    res.json({ success: true, message: 'OTP resent!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 3. Verify OTP and create Razorpay order
router.post('/verify-otp', async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Check OTP expiry
    if (new Date() > new Date(booking.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    
    // Check OTP match
    if (booking.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // Mark as verified
    booking.isVerified = true;
    booking.otp = undefined;
    booking.otpExpiry = undefined;
    
    // Now create Razorpay order for payment
    const razorpayOrder = await razorpay.orders.create({
      amount: booking.totalAmount,
      currency: 'INR',
      receipt: `receipt-booking-${Date.now()}`
    });
    
    booking.razorpayOrderId = razorpayOrder.id;
    await booking.save();
    await booking.populate('service');
    
    res.json({
      success: true,
      booking,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Verify booking payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    // HMAC verification
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpaySignature) {
      // Update booking
      const booking = await Booking.findOne({ razorpayOrderId });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      booking.razorpayPaymentId = razorpayPaymentId;
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      await booking.populate('service');

      res.json({ success: true, booking, message: 'Payment successful! Booking confirmed.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 3. Get all bookings (Admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 4. Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 5. Update booking status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;