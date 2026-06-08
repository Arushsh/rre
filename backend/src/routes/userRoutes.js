const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
