const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Get user preferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    res.json({
      success: true,
      preferences: user.preferences || {
        cities: [],
        minPrice: 0,
        maxPrice: 3000,
        minRooms: 1,
        minSize: 0,
        maxSize: 500,
        furnished: 'both',
        petsAllowed: false,
        features: []
      }
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Beschikbare steden (gedeeld met scraper config)
router.get('/cities', async (req, res) => {
  try {
    const citiesPath = path.join(__dirname, '..', '..', 'scraper', 'config', 'cities_nl.json');
    const raw = fs.readFileSync(citiesPath, 'utf-8');
    const cities = JSON.parse(raw);
    res.json({ success: true, cities });
  } catch (error) {
    console.error('Error reading cities list:', error.message);
    res.status(500).json({ success: false, error: 'Kon stedenlijst niet laden' });
  }
});

// Save or update user preferences
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      cities,
      minPrice,
      maxPrice,
      minRooms,
      minSize,
      maxSize,
      furnished,
      petsAllowed,
      features,
      availableFrom
    } = req.body;

    // Validation
    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ error: 'Selecteer minimaal één stad' });
    }

    if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
      return res.status(400).json({ error: 'Ongeldige prijsrange' });
    }

    if (minRooms < 1) {
      return res.status(400).json({ error: 'Minimaal 1 kamer vereist' });
    }

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        preferences: {
          cities,
          minPrice,
          maxPrice,
          minRooms,
          minSize,
          maxSize,
          furnished: furnished || 'both',
          petsAllowed: petsAllowed || false,
          features: features || [],
          availableFrom: availableFrom || null
        },
        onboardingCompleted: true // Mark onboarding as complete
      },
      { new: true, runValidators: true }
    ).select('preferences onboardingCompleted');

    res.json({
      success: true,
      message: 'Voorkeuren succesvol opgeslagen',
      preferences: user.preferences,
      onboardingCompleted: user.onboardingCompleted
    });
  } catch (error) {
    console.error('Error saving preferences:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// Update specific preference fields
router.patch('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    // Build update object with dot notation for nested fields
    const updateObj = {};
    for (const [key, value] of Object.entries(updates)) {
      updateObj[`preferences.${key}`] = value;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({
      success: true,
      message: 'Voorkeuren bijgewerkt',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
