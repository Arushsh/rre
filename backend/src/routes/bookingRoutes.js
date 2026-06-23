const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Razorpay = require('razorpay');
const axios = require('axios');

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

// SMS API configuration
const SMS_API_URL = 'https://apitxt.com/api/sendOTP';
const SMS_API_KEY = process.env.SMS_API_KEY;

// Send OTP via SMS (fire and forget — does not block response)
const sendOTPSMS = (phone, otp) => {
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.length > 10) {
    formattedPhone = formattedPhone.slice(-10);
  }
  axios.post(SMS_API_URL, {
    authkey: SMS_API_KEY,
    mobile: formattedPhone,
    otp: otp
  }).catch(() => {});
};

// Send OTP email (fire and forget)
const sendOTPEmail = (email, name, otp) => {
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
          <p style="color: #666;">This OTP is valid for <strong>60 minutes</strong>.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
  };
  transporter.sendMail(mailOptions).catch(() => {});
};

// 1. Create a new booking and send OTP
router.post('/', async (req, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone, serviceId, eventDate, eventLocation, additionalNotes
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !serviceId || !eventDate || !eventLocation) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes expiry

    const booking = new Booking({
      customerName,
      customerEmail,
      customerPhone,
      service: serviceId,
      eventDate,
      eventLocation,
      additionalNotes,
      totalAmount: 0,
      otp,
      otpExpiry,
      isVerified: false
    });

    await booking.save();
    await booking.populate('service');

    // Send OTP notifications in background (non-blocking)
    sendOTPSMS(customerPhone, otp);
    sendOTPEmail(customerEmail, customerName, otp);

    res.json({
      success: true,
      booking,
      message: 'Booking created. OTP sent to your phone!'
    });

  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to create booking' });
  }
});

// 2. Resend OTP
router.post('/:bookingId/resend-otp', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);

    booking.otp = otp;
    booking.otpExpiry = otpExpiry;
    await booking.save();

    // Send in background
    sendOTPSMS(booking.customerPhone, otp);
    sendOTPEmail(booking.customerEmail, booking.customerName, otp);

    res.json({ success: true, message: 'OTP resent!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Verify OTP and confirm booking
router.post('/verify-otp', async (req, res) => {
  try {
    const { bookingId, otp } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (new Date() > new Date(booking.otpExpiry)) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    if (String(booking.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    booking.isVerified = true;
    booking.otp = undefined;
    booking.otpExpiry = undefined;
    booking.status = 'confirmed';
    booking.paymentStatus = 'pending';

    await booking.save();
    await booking.populate('service');

    res.json({ success: true, booking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Verify booking payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpaySignature) {
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
    res.status(500).json({ message: err.message });
  }
});

// 5. Get all bookings (Admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Update booking status (Admin)
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
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;