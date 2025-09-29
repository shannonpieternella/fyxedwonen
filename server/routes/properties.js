const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Property = require('../models/Property');
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
      min_size,
      max_size,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const filter = { isActive: true, approvalStatus: 'approved' };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }

    if (min_prijs || max_prijs) {
      filter.price = {};
      if (min_prijs) filter.price.$gte = parseInt(min_prijs);
      if (max_prijs) filter.price.$lte = parseInt(max_prijs);
    }

    if (bedrooms) {
      filter.bedrooms = parseInt(bedrooms);
    }

    if (min_size || max_size) {
      filter.size = {};
      if (min_size) filter.size.$gte = parseInt(min_size);
      if (max_size) filter.size.$lte = parseInt(max_size);
    }

    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const count = await Property.countDocuments({
      'address.city': new RegExp(city, 'i'),
      isActive: true,
      approvalStatus: 'approved'
    });
    res.json({ city, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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