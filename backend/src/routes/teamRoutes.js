const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a team member
router.post('/', async (req, res) => {
  const team = new Team(req.body);
  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a team member
router.put('/:id', async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a team member
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
