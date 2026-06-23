const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Default services to seed
const defaultServices = [
  {
    category: 'photography',
    title: 'Wedding Photography',
    description: 'Capture your special day with artistic perfection.',
    price: '25000',
    features: ['Full Day Coverage', 'Edited Photos', 'Online Gallery']
  },
  {
    category: 'photography',
    title: 'Portrait Photography',
    description: 'Professional portraits for individuals and families.',
    price: '10000',
    features: ['2 Hour Session', 'Edited Photos', 'Studio Setup']
  },
  {
    category: 'videography',
    title: 'Cinematic Wedding Film',
    description: 'Stunning cinematic films telling your love story.',
    price: '45000',
    features: ['Full Day Coverage', '4K Video', 'Drone Shots']
  },
  {
    category: 'videography',
    title: 'Corporate Video',
    description: 'Professional corporate and promotional videos.',
    price: '30000',
    features: ['Scriptwriting', 'Editing', 'Color Grading']
  },
  {
    category: 'audio',
    title: 'Music Recording',
    description: 'High-quality vocal and instrument recording.',
    price: '15000',
    features: ['Professional Gear', 'Sound Engineer', 'Mixing']
  },
  {
    category: 'production',
    title: 'Music Production',
    description: 'Custom beats and full track arrangement.',
    price: '20000',
    features: ['Beat Making', 'Arrangement', 'Mastering']
  }
];

// Get all services
router.get('/', async (req, res) => {
  try {
    let services = await Service.find();
    
    // Seed default services if none exist
    if (services.length === 0) {
      await Service.insertMany(defaultServices);
      services = await Service.find();
    }
    
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get services by category
router.get('/category/:category', async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a service
router.post('/', async (req, res) => {
  const service = new Service(req.body);
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
