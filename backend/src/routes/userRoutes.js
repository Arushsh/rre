const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SMS API configuration
const SMS_API_URL = 'https://apitxt.com/api/sendOTP';
const SMS_API_KEY = process.env.SMS_API_KEY;

// Send OTP via SMS (fire and forget — non-blocking)
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

// Send OTP via SMS
router.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 mins

  try {
    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({
        mobile,
        name: 'Guest',
        email: `temp_${mobile}@rre.app`,
        isVerified: false
      });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send SMS in background (non-blocking)
    sendOTPSMS(mobile, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP & Register/Login
router.post('/verify-otp', async (req, res) => {
  const { mobile, otp, firstName, lastName, email, slug, selfieUrl } = req.body;
  try {
    const tempUser = await User.findOne({ mobile });
    if (!tempUser) {
      return res.status(400).json({ message: 'User not found with this mobile number' });
    }

    if (String(tempUser.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Incorrect OTP entered' });
    }
    if (new Date(tempUser.otpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    let finalUser = tempUser;

    // If email provided, check for an existing user with that email
    if (email) {
      const existingEmailUser = await User.findOne({ email, _id: { $ne: tempUser._id } });
      if (existingEmailUser) {
        // Merge into existing account
        if (mobile) existingEmailUser.mobile = mobile;
        if (selfieUrl) existingEmailUser.selfieUrl = selfieUrl;
        if (firstName) existingEmailUser.firstName = firstName;
        if (lastName) existingEmailUser.lastName = lastName;
        if (firstName && lastName) existingEmailUser.name = `${firstName} ${lastName}`;
        existingEmailUser.isVerified = true;

        if (slug) {
          const Gallery = mongoose.model('Gallery');
          const gallery = await Gallery.findOne({ slug });
          if (gallery && !existingEmailUser.myEvents.includes(gallery._id)) {
            existingEmailUser.myEvents.push(gallery._id);
          }
        }

        await existingEmailUser.save();
        await User.deleteOne({ _id: tempUser._id });

        return res.json({ message: 'User verified successfully', user: existingEmailUser });
      }
    }

    // No conflict — update temp user
    finalUser.isVerified = true;
    finalUser.otp = undefined;
    finalUser.otpExpiry = undefined;

    if (firstName) finalUser.firstName = firstName;
    if (lastName) finalUser.lastName = lastName;
    if (firstName && lastName) finalUser.name = `${firstName} ${lastName}`;
    if (email) finalUser.email = email;
    if (selfieUrl) finalUser.selfieUrl = selfieUrl;

    if (slug) {
      const Gallery = mongoose.model('Gallery');
      const gallery = await Gallery.findOne({ slug });
      if (gallery && !finalUser.myEvents.includes(gallery._id)) {
        finalUser.myEvents.push(gallery._id);
      }
    }

    await finalUser.save();
    res.json({ message: 'User verified successfully', user: finalUser });
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
        isVerified: true,
      });
    }

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

// Get client by email
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
