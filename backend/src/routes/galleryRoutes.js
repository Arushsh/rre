const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const mongoose = require('mongoose');

// ─── STATIC ROUTES FIRST (must be before /:slug wildcard) ──────────────────

// Get all galleries
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Admin Stats — MUST be before /:slug
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

// Verify Gallery Password — MUST be before /:slug
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

// Delete a gallery by ID (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format first to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID' });
    }

    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });

    res.json({ success: true, message: 'Gallery deleted successfully' });
  } catch (err) {
    console.error('Delete gallery error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update a gallery by ID (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid gallery ID' });
    }

    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });

    res.json(gallery);
  } catch (err) {
    console.error('Update gallery error:', err.message);
    res.status(500).json({ success: false, message: err.message });
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

// ─── DYNAMIC WILDCARD LAST ──────────────────────────────────────────────────

// Get single gallery by slug — MUST be last
router.get('/:slug', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ slug: req.params.slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
