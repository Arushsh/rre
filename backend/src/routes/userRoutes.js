const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
// Get all clients (for admin)
router.get('/', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).populate('myEvents');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new client or update existing one during onboarding
router.post('/onboard', async (req, res) => {
  const { name, email, mobile, selfieUrl, slug } = req.body;
  try {
    let user = await User.findOne({ email });
    
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      user.name = name;
      user.mobile = mobile;
      user.selfieUrl = selfieUrl;
      user.otp = generatedOtp;
      user.otpExpiry = otpExpiryTime;
    } else {
      user = new User({
        name,
        email,
        mobile,
        selfieUrl,
        otp: generatedOtp,
        otpExpiry: otpExpiryTime,
        role: 'client',
        password: Math.random().toString(36).slice(-8) // Random temp password
      });
    }

    // Find the gallery by slug and assign it
    const Gallery = mongoose.model('Gallery');
    const gallery = await Gallery.findOne({ slug });
    if (gallery && !user.myEvents.includes(gallery._id)) {
      user.myEvents.push(gallery._id);
    }

    await user.save();

    // Send OTP via Email
    if (email) {
      await sendEmail({
        email: email,
        subject: 'Your Verification OTP',
        message: `Your verification code is ${generatedOtp}. It will expire in 10 minutes.`
      }).catch(err => console.error('Failed to send email:', err));
    }
    
    // Send OTP via SMS
    if (mobile) {
      await sendSMS({
        phone: mobile,
        message: `Your Rajat Raj Entertainment verification code is ${generatedOtp}.`
      }).catch(err => console.error('Failed to send SMS:', err));
    }

    res.status(200).json({ message: 'User onboarded successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!otp || otp.length !== 6) {
    return res.status(400).json({ message: 'Invalid OTP format' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
