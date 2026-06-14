const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email Transporter for OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Create a temporary user or just send OTP if registering
      user = new User({ email, name: 'Guest', isVerified: false });
    }
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await transporter.sendMail({
      from: `"RRE Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for RRE Registration",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #000;">RRE ENTERTAINMENT</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #ff3366; letter-spacing: 5px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP & Register/Login
router.post('/verify-otp', async (req, res) => {
  const { email, otp, name, mobile, password, slug } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (password) user.password = password; // Should hash in production

    // Assign gallery if slug provided
    if (slug) {
      const Gallery = mongoose.model('Gallery');
      const gallery = await Gallery.findOne({ slug });
      if (gallery && !user.myEvents.includes(gallery._id)) {
        user.myEvents.push(gallery._id);
      }
    }

    await user.save();
    res.json({ message: 'User verified successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all clients (for admin)
router.get('/', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).populate('myEvents');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google Sign-In Onboarding
router.post('/onboard-google', async (req, res) => {
  const { googleToken, mobile, selfieUrl, slug } = req.body;

  if (!googleToken) {
    return res.status(400).json({ message: 'Google token is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    if (user) {
      if (mobile) user.mobile = mobile;
      if (selfieUrl) user.selfieUrl = selfieUrl;
    } else {
      user = new User({
        name,
        email,
        mobile: mobile || '',
        selfieUrl: selfieUrl || '',
        role: 'client',
        isVerified: true, // Google accounts are verified
      });
    }

    // Assign gallery if slug provided
    if (slug) {
      const Gallery = mongoose.model('Gallery');
      const gallery = await Gallery.findOne({ slug });
      if (gallery && !user.myEvents.includes(gallery._id)) {
        user.myEvents.push(gallery._id);
      }
    }

    await user.save();
    
    res.status(200).json({ message: 'User onboarded successfully', user });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(400).json({ message: 'Authentication failed', error: err.message });
  }
});

// Assign event to client
router.post('/assign-event', async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.myEvents.includes(eventId)) {
      user.myEvents.push(eventId);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get client by email (for simple "login" demo)
router.get('/login/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('myEvents');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
