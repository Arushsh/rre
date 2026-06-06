const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all galleries (Admin only usually, but public for now for demo)
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single gallery by slug
router.get('/:slug', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ slug: req.params.slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    
    // We don't send the password and media list if it's protected and not verified yet
    // But for simplicity in this demo, we'll send everything and handle protection on frontend
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Gallery Password
router.post('/verify-password', async (req, res) => {
  const { slug, password } = req.body;
  try {
    const gallery = await Gallery.findOne({ slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    
    if (gallery.password === password) {
      res.json({ success: true, media: gallery.media });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Admin Stats
router.get('/admin/stats', async (req, res) => {
  try {
    const galleries = await Gallery.find();
    const stats = {
      totalEvents: galleries.length,
      totalClients: await mongoose.model('User').countDocuments({ role: 'client' }),
      totalRevenue: galleries.reduce((acc, curr) => acc + (curr.revenue || 0), 0),
      totalDownloads: galleries.reduce((acc, curr) => acc + (curr.downloads || 0), 0)
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new gallery (Admin)
router.post('/', async (req, res) => {
  const { title, slug, eventDate, location, photographer, password, coverImage, media, revenue } = req.body;
  
  const gallery = new Gallery({
    title,
    slug,
    eventDate,
    location,
    photographer,
    password,
    coverImage,
    media: media || [],
    revenue: revenue || 0,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BASE_URL_PLACEHOLDER/onboarding/${slug}`
  });

  try {
    const newGallery = await gallery.save();
    res.status(201).json(newGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add Media to existing gallery
router.post('/:slug/add-media', async (req, res) => {
  const { media } = req.body;
  try {
    const gallery = await Gallery.findOne({ slug: req.params.slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    
    gallery.media.push(...media);
    await gallery.save();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
