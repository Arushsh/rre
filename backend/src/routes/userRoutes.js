const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
    
    if (user) {
      user.name = name;
      user.mobile = mobile;
      user.selfieUrl = selfieUrl;
    } else {
      user = new User({
        name,
        email,
        mobile,
        selfieUrl,
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
    res.status(200).json({ message: 'User onboarded successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mock OTP verification
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  // For demo, any 6 digit OTP is valid
  if (otp && otp.length === 6) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.isVerified = true;
        await user.save();
        res.json({ success: true, message: 'Verified successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
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
