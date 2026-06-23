const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const axios = require('axios');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SMS API configuration
const SMS_API_URL = 'https://apitxt.com/api/sendOTP';
const SMS_API_KEY = process.env.SMS_API_KEY;

// Function to send OTP via SMS
const sendOTPSMS = async (phone, otp) => {
  try {
    // Ensure phone number is in correct format (10 digits only)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digit characters
    if (formattedPhone.length > 10) {
      formattedPhone = formattedPhone.slice(-10); // Take last 10 digits
    }

    // Log OTP for testing purposes
    console.log('📱 Sending Registration OTP:', otp, 'to:', formattedPhone);
    
    // Call apitxt.com OTP API
    const response = await axios.post(SMS_API_URL, {
      authkey: SMS_API_KEY,
      mobile: formattedPhone,
      otp: otp
    });
    
    console.log('✅ Registration OTP SMS sent successfully:', response.data);
    return true;
  } catch (err) {
    console.error('❌ Error sending registration SMS:', err.response ? err.response.data : err.message);
    // Still return true for testing even if API fails
    return true;
  }
};

// Send OTP via SMS
router.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 mins

  try {
    let user = await User.findOne({ mobile });
    if (!user) {
      // Create a temporary user
      user = new User({ 
        mobile, 
        name: 'Guest', 
        email: '', 
        isVerified: false 
      });
    }
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPSMS(mobile, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP & Register/Login
router.post('/verify-otp', async (req, res) => {
  const { mobile, otp, firstName, lastName, email, slug, selfieUrl } = req.body;
  try {
    // Find the temp user created during send-otp
    const tempUser = await User.findOne({ mobile });
    if (!tempUser) {
      return res.status(400).json({ message: 'User not found with this mobile number' });
    }

    // Verify OTP
    if (String(tempUser.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Incorrect OTP entered' });
    }
    if (new Date(tempUser.otpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    let finalUser = tempUser;

    // If email is provided, check if another user already owns that email
    if (email) {
      const existingEmailUser = await User.findOne({ email, _id: { $ne: tempUser._id } });
      if (existingEmailUser) {
        // Merge: update the existing email user with the new mobile/selfie info
        if (mobile) existingEmailUser.mobile = mobile;
        if (selfieUrl) existingEmailUser.selfieUrl = selfieUrl;
        if (firstName) existingEmailUser.firstName = firstName;
        if (lastName) existingEmailUser.lastName = lastName;
        if (firstName && lastName) existingEmailUser.name = `${firstName} ${lastName}`;
        existingEmailUser.isVerified = true;

        // Assign gallery if slug provided
        if (slug) {
          const Gallery = mongoose.model('Gallery');
          const gallery = await Gallery.findOne({ slug });
          if (gallery && !existingEmailUser.myEvents.includes(gallery._id)) {
            existingEmailUser.myEvents.push(gallery._id);
          }
        }

        await existingEmailUser.save();

        // Delete the temp mobile-only user to keep DB clean
        await User.deleteOne({ _id: tempUser._id });

        finalUser = existingEmailUser;
        return res.json({ message: 'User verified successfully', user: finalUser });
      }
    }

    // No conflict — update the temp user normally
    finalUser.isVerified = true;
    finalUser.otp = undefined;
    finalUser.otpExpiry = undefined;

    if (firstName) finalUser.firstName = firstName;
    if (lastName) finalUser.lastName = lastName;
    if (firstName && lastName) finalUser.name = `${firstName} ${lastName}`;
    if (email) finalUser.email = email;
    if (selfieUrl) finalUser.selfieUrl = selfieUrl;

    // Assign gallery if slug provided
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
    console.error('Verify OTP Error:', err);
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
