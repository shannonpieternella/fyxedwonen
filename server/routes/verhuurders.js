const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Verhuurder = require('../models/Verhuurder');
const Property = require('../models/Property');
const Message = require('../models/Message');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fyxedwonen/properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
    ]
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

// Register as verhuurder - direct registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      company,
      address,
      propertyTypes,
      experience,
      motivation
    } = req.body;

    // Check if verhuurder already exists
    const existingVerhuurder = await Verhuurder.findOne({ email });
    if (existingVerhuurder) {
      return res.status(400).json({
        message: 'Er bestaat al een account met dit e-mailadres'
      });
    }

    // Create verhuurder account (pending approval but can login)
    const verhuurder = new Verhuurder({
      name,
      email,
      password,
      phone,
      company,
      address,
      propertyTypes,
      experience,
      motivation,
      isApproved: false // Admin can approve later via database
    });

    await verhuurder.save();

    // Generate token for immediate login
    const token = jwt.sign(
      { verhuurderEmail: verhuurder.email, type: 'verhuurder' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // TODO: Send email notification to admin about new registration
    console.log('New verhuurder registration:', {
      name,
      email,
      phone,
      company,
      propertyTypes
    });

    res.status(201).json({
      message: 'Account succesvol aangemaakt! Je kunt nu inloggen en woningen toevoegen.',
      token,
      verhuurder: {
        name: verhuurder.name,
        email: verhuurder.email,
        company: verhuurder.company,
        isApproved: verhuurder.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login verhuurder
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find verhuurder
    const verhuurder = await Verhuurder.findOne({ email });
    if (!verhuurder) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens' });
    }

    // Allow login even if not approved (they can add properties, admin approves later)

    // Check password
    const isPasswordValid = await verhuurder.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens' });
    }

    // Generate token
    const token = jwt.sign(
      { verhuurderEmail: verhuurder.email, type: 'verhuurder' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      verhuurder: {
        name: verhuurder.name,
        email: verhuurder.email,
        company: verhuurder.company
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to authenticate verhuurder
const authenticateVerhuurder = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Geen toegang - token ontbreekt' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'verhuurder') {
      return res.status(401).json({ message: 'Geen toegang - geen verhuurder token' });
    }

    const verhuurder = await Verhuurder.findOne({ email: decoded.verhuurderEmail });
    if (!verhuurder) {
      return res.status(401).json({ message: 'Verhuurder niet gevonden' });
    }
    // Allow access even if not approved - admin can manage approval via database

    req.verhuurder = verhuurder;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token ongeldig' });
  }
};

// Get verhuurder dashboard data
router.get('/dashboard', authenticateVerhuurder, async (req, res) => {
  try {
    const verhuurderEmail = req.verhuurder.email;

    // Get properties count
    const totalProperties = await Property.countDocuments({
      verhuurderEmail,
      isActive: true
    });

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      verhuurderEmail,
      isRead: false
    });

    // Get recent messages
    const recentMessages = await Message.find({
      verhuurderEmail
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Get properties stats
    const propertiesWithViews = await Property.find({
      verhuurderEmail,
      isActive: true
    }).select('title price address createdAt');

    res.json({
      stats: {
        totalProperties,
        unreadMessages,
        totalMessages: await Message.countDocuments({ verhuurderEmail }),
        joinDate: req.verhuurder.joinDate
      },
      recentMessages,
      recentProperties: propertiesWithViews.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get verhuurder properties
router.get('/properties', authenticateVerhuurder, async (req, res) => {
  try {
    const properties = await Property.find({
      verhuurderEmail: req.verhuurder.email
    }).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new property
router.post('/properties', authenticateVerhuurder, upload.array('images', 10), async (req, res) => {
  try {
    const propertyData = {
      title: req.body.title,
      address: {
        street: req.body.street,
        city: req.body.city,
        postalCode: req.body.postalCode
      },
      price: parseInt(req.body.price),
      size: parseInt(req.body.size),
      rooms: parseInt(req.body.rooms),
      bedrooms: parseInt(req.body.bedrooms),
      yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : undefined,
      energyLabel: req.body.energyLabel,
      description: req.body.description,
      furnished: req.body.furnished === 'true',
      petsAllowed: req.body.petsAllowed === 'true',
      garden: req.body.garden === 'true',
      parking: req.body.parking === 'true',
      balcony: req.body.balcony === 'true',
      verhuurderEmail: req.verhuurder.email,
      verhuurderName: req.verhuurder.name,
      contact: {
        name: req.verhuurder.name,
        email: req.verhuurder.email,
        phone: req.verhuurder.phone
      }
    };

    // Handle uploaded images (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => file.path); // Cloudinary URL is in file.path
    }

    const property = new Property(propertyData);
    await property.save();

    // Update verhuurder stats
    await Verhuurder.findOneAndUpdate(
      { email: req.verhuurder.email },
      { $inc: { totalProperties: 1 } }
    );

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update property
router.put('/properties/:id', authenticateVerhuurder, upload.array('images', 10), async (req, res) => {
  try {
    // Build the property data from form fields
    const propertyData = {
      title: req.body.title,
      address: {
        street: req.body.street,
        city: req.body.city,
        postalCode: req.body.postalCode
      },
      price: parseInt(req.body.price),
      size: parseInt(req.body.size),
      rooms: parseInt(req.body.rooms),
      bedrooms: parseInt(req.body.bedrooms),
      yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : undefined,
      energyLabel: req.body.energyLabel,
      description: req.body.description,
      furnished: req.body.furnished === 'true',
      petsAllowed: req.body.petsAllowed === 'true',
      garden: req.body.garden === 'true',
      parking: req.body.parking === 'true',
      balcony: req.body.balcony === 'true'
    };

    // Handle images
    const currentImages = [];
    // Collect current images that should remain
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('currentImages[') && key.endsWith(']')) {
        currentImages.push(req.body[key]);
      }
    });

    // Add new uploaded images (Cloudinary returns full URLs)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path); // Cloudinary URL is in file.path
      propertyData.images = [...currentImages, ...newImages];
    } else {
      propertyData.images = currentImages;
    }

    const property = await Property.findOneAndUpdate(
      {
        _id: req.params.id,
        verhuurderEmail: req.verhuurder.email
      },
      propertyData,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property niet gevonden' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete property
router.delete('/properties/:id', authenticateVerhuurder, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      verhuurderEmail: req.verhuurder.email
    });

    if (!property) {
      return res.status(404).json({ message: 'Property niet gevonden' });
    }

    // Update verhuurder stats
    await Verhuurder.findOneAndUpdate(
      { email: req.verhuurder.email },
      { $inc: { totalProperties: -1 } }
    );

    res.json({ message: 'Property verwijderd' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages
router.get('/messages', authenticateVerhuurder, async (req, res) => {
  try {
    const messages = await Message.find({
      verhuurderEmail: req.verhuurder.email
    }).sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read
router.put('/messages/:id/read', authenticateVerhuurder, async (req, res) => {
  try {
    await Message.findOneAndUpdate(
      {
        _id: req.params.id,
        verhuurderEmail: req.verhuurder.email
      },
      {
        isRead: true,
        status: 'read'
      }
    );

    res.json({ message: 'Bericht gemarkeerd als gelezen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes for property approval (these would be protected by admin auth in production)
router.get('/admin/properties/pending', async (req, res) => {
  try {
    // Find all properties that are NOT approved (including those without approval status)
    const pendingProperties = await Property.find({
      $or: [
        { approvalStatus: 'pending' },
        { approvalStatus: { $exists: false } }, // Old properties without approval status
        { approvalStatus: null }
      ]
    }).populate('verhuurderEmail', 'name email').sort({ createdAt: -1 });

    res.json(pendingProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New route to get ALL properties for admin overview
router.get('/admin/properties/all', async (req, res) => {
  try {
    const allProperties = await Property.find({})
      .populate('verhuurderEmail', 'name email')
      .sort({ createdAt: -1 });

    res.json(allProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/properties/:id/approve', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'approved',
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property niet gevonden' });
    }

    res.json({ message: 'Property goedgekeurd', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/properties/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        rejectedAt: new Date(),
        rejectionReason: reason || 'Geen reden opgegeven'
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property niet gevonden' });
    }

    res.json({ message: 'Property afgewezen', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;