const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Property = require('../models/Property');
const mongoose = require('mongoose');
const Message = require('../models/Message');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/properties';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      city,
      min_prijs,
      max_prijs,
      bedrooms,
      rooms,
      min_size,
      max_size,
      furnished,
      pets,
      garden,
      parking,
      balcony,
      features,
      source,
      available_only = (process.env.PUBLIC_PROPERTIES_AVAILABLE_ONLY || '0'),
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    const requireActive = (process.env.PUBLIC_PROPERTIES_REQUIRE_ACTIVE || '0') === '1';
    const approvedOnly = (process.env.PUBLIC_PROPERTIES_REQUIRE_APPROVED || '0') === '1';
    if (requireActive) filter.isActive = true;
    if (approvedOnly) filter.approvalStatus = 'approved';
    if (String(available_only) === '1') {
      filter.isStillAvailable = true;
      filter.isArchived = { $ne: true };
    }

    if (city) {
      // Normalize city: allow slugs like "den-haag" by converting hyphens to spaces
      const normalizedCity = String(city).replace(/-/g, ' ');
      filter['address.city'] = new RegExp(normalizedCity, 'i');
    }

    if (min_prijs || max_prijs) {
      filter.price = {};
      if (min_prijs) filter.price.$gte = parseInt(min_prijs);
      if (max_prijs) filter.price.$lte = parseInt(max_prijs);
    }

    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (rooms) filter.rooms = parseInt(rooms);

    if (min_size || max_size) {
      filter.size = {};
      if (min_size) filter.size.$gte = parseInt(min_size);
      if (max_size) filter.size.$lte = parseInt(max_size);
    }

    if (typeof furnished !== 'undefined') {
      const v = String(furnished).toLowerCase();
      if (v === 'true' || v === '1') filter.furnished = true;
      if (v === 'false' || v === '0') filter.furnished = false;
    }
    if (typeof pets !== 'undefined') {
      const v = String(pets).toLowerCase();
      if (v === 'true' || v === '1') filter.petsAllowed = true;
      if (v === 'false' || v === '0') filter.petsAllowed = false;
    }
    if (typeof garden !== 'undefined') {
      const v = String(garden).toLowerCase();
      if (v === 'true' || v === '1') filter.garden = true;
      if (v === 'false' || v === '0') filter.garden = false;
    }
    if (typeof parking !== 'undefined') {
      const v = String(parking).toLowerCase();
      if (v === 'true' || v === '1') filter.parking = true;
      if (v === 'false' || v === '0') filter.parking = false;
    }
    if (typeof balcony !== 'undefined') {
      const v = String(balcony).toLowerCase();
      if (v === 'true' || v === '1') filter.balcony = true;
      if (v === 'false' || v === '0') filter.balcony = false;
    }
    if (features) {
      const list = String(features).split(',').map(s=>s.trim()).filter(Boolean);
      if (list.length) filter.features = { $all: list };
    }
    if (source) {
      const list = String(source).split(',').map(s=>s.trim()).filter(Boolean);
      if (list.length) filter.source = { $in: list };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      pagination: {
        current: pageNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// City count (place before :id to avoid route conflicts)
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const normalizedCity = String(city).replace(/-/g, ' ');
    const match = {
      'address.city': new RegExp(normalizedCity, 'i')
    };
    const requireActive = (process.env.PUBLIC_PROPERTIES_REQUIRE_ACTIVE || '0') === '1';
    const approvedOnly = (process.env.PUBLIC_PROPERTIES_REQUIRE_APPROVED || '0') === '1';
    const availableOnly = (process.env.PUBLIC_PROPERTIES_AVAILABLE_ONLY || '0') === '1';
    if (requireActive) match.isActive = true;
    if (approvedOnly) match.approvalStatus = 'approved';
    if (availableOnly) { match.isStillAvailable = true; match.isArchived = { $ne: true }; }
    const count = await Property.countDocuments(match);
    res.json({ city, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Distinct cities with counts (for public directory and search)
router.get('/cities', async (req, res) => {
  try {
    const { q, limit = 500 } = req.query;
    const match = { 'address.city': { $ne: null } };
    const requireActive = (process.env.PUBLIC_PROPERTIES_REQUIRE_ACTIVE || '0') === '1';
    const approvedOnly = (process.env.PUBLIC_PROPERTIES_REQUIRE_APPROVED || '0') === '1';
    const availableOnly = (process.env.PUBLIC_PROPERTIES_AVAILABLE_ONLY || '0') === '1';
    if (requireActive) match.isActive = true;
    if (approvedOnly) match.approvalStatus = 'approved';
    if (availableOnly) { match.isStillAvailable = true; match.isArchived = { $ne: true }; }
    if (q) match['address.city'] = new RegExp(String(q), 'i');

    const pipeline = [
      { $match: match },
      { $group: {
          _id: { $toLower: '$address.city' },
          name: { $first: '$address.city' },
          count: { $sum: 1 }
        } },
      { $sort: { count: -1, name: 1 } },
      { $limit: parseInt(limit) }
    ];

    let cities = await Property.aggregate(pipeline);
    // Compute slug and ensure plain object
    cities = cities.map(c => ({
      name: c.name,
      count: c.count,
      slug: String(c.name || '').toLowerCase().replace(/\s+/g, '-')
    }));
    // Grand total: count all properties in the collection (independent of city filters)
    let grandTotal = 0;
    try {
      grandTotal = await Property.estimatedDocumentCount();
      if (!grandTotal || Number.isNaN(grandTotal)) {
        grandTotal = await Property.countDocuments({});
      }
    } catch (_) {
      grandTotal = cities.reduce((sum, c) => sum + (Number(c.count) || 0), 0);
    }
    res.json({ success: true, cities, total: grandTotal });
  } catch (error) {
    console.error('cities error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Debug stats for troubleshooting DB mismatches (safe, minimal info)
// IMPORTANT: This must be before /:id route to avoid being caught by the parameter matcher
router.get('/_stats', async (req, res) => {
  try {
    const col = mongoose.connection.collection('properties');
    const [estimated, exact] = await Promise.all([
      col.estimatedDocumentCount().catch(()=>0),
      col.countDocuments({}).catch(()=>0)
    ]);
    const topCities = await Property.aggregate([
      { $match: { 'address.city': { $ne: null } } },
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).catch(()=>[]);
    res.json({
      success: true,
      db: {
        name: mongoose.connection?.name,
        host: mongoose.connection?.host,
      },
      counts: { estimated, exact },
      topCities
    });
  } catch (e) {
    res.status(500).json({ success:false, error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      // Convert string values back to proper types
      price: parseInt(req.body.price),
      size: parseInt(req.body.size),
      rooms: parseInt(req.body.rooms),
      bedrooms: parseInt(req.body.bedrooms),
      yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : undefined,
      furnished: req.body.furnished === 'true',
      petsAllowed: req.body.petsAllowed === 'true',
      garden: req.body.garden === 'true',
      parking: req.body.parking === 'true',
      balcony: req.body.balcony === 'true',
    };

    // Add uploaded images to the property
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => `/uploads/properties/${file.filename}`);
    }

    const property = new Property(propertyData);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: error.message });
  }
});

// (moved /city/:city above)

// Contact property owner
router.post('/contact', async (req, res) => {
  try {
    const {
      propertyId,
      verhuurderEmail,
      userEmail,
      userName,
      message,
      propertyTitle
    } = req.body;

    // Validate required fields
    if (!propertyId || !verhuurderEmail || !userEmail || !userName || !message || !propertyTitle) {
      return res.status(400).json({
        message: 'Alle velden zijn verplicht.'
      });
    }

    // Verify property exists and get verhuurder info
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        message: 'Woning niet gevonden.'
      });
    }

    // Get verhuurder name
    const Verhuurder = require('../models/Verhuurder');
    const verhuurder = await Verhuurder.findOne({ email: verhuurderEmail });
    const verhuurderName = verhuurder ? verhuurder.name : 'Verhuurder';

    // Create conversation ID for threading
    const conversationId = `${propertyId}_${userEmail}_${verhuurderEmail}`;

    // Create message
    const newMessage = new Message({
      propertyId,
      verhuurderEmail,
      verhuurderName,
      userEmail,
      userName,
      message,
      propertyTitle,
      senderType: 'user',
      conversationId,
      readBy: {
        user: true, // User has read their own message
        verhuurder: false // Verhuurder hasn't read it yet
      },
      // Legacy fields
      isRead: false,
      status: 'sent'
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Bericht succesvol verzonden naar de verhuurder.'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
