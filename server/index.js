const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Please check your .env file and MongoDB Atlas credentials');
    process.exit(1);
  }
};

// MongoDB connection instance
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Connect to MongoDB
connectDB();

// Start cron jobs after DB connection
const scheduler = require('./jobs/scheduler');
const scrapeRunner = require('./jobs/scrapeRunner');
const watchNewProperties = require('./jobs/watchNewProperties');
db.once('open', () => {
  console.log('🕐 Initializing cron jobs...');
  scheduler.startAll();
  // Start scraper schedule
  try {
    const enableScraperScheduler = (process.env.SCRAPER_SCHEDULER_ENABLED || '1') === '1';
    if (enableScraperScheduler) {
      scrapeRunner.schedule();
    } else {
      console.log('⏸️ Scraper scheduler disabled (set SCRAPER_SCHEDULER_ENABLED=1 to enable)');
    }
  } catch (e) {
    console.error('Failed to schedule scraper runs:', e.message);
  }
  // Optional realtime watcher: start when ENABLE_LISTING_WATCH=1
  if (process.env.ENABLE_LISTING_WATCH === '1') {
    try {
      watchNewProperties.start();
    } catch (e) {
      console.error('Failed to start new listing watcher:', e.message);
    }
  } else {
    console.log('ℹ️ Listing watcher disabled (set ENABLE_LISTING_WATCH=1 to enable)');
  }
});

const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const stripeRoutes = require('./routes/stripe');
const verhuurderRoutes = require('./routes/verhuurders');
const messageRoutes = require('./routes/messages');

// RentBird routes
const preferencesRoutes = require('./routes/preferences');
const matchesRoutes = require('./routes/matches');
const dashboardRoutes = require('./routes/dashboard');
const subscriptionRoutes = require('./routes/subscription');
const adminRoutes = require('./routes/admin');

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/verhuurders', verhuurderRoutes);
app.use('/api/messages', messageRoutes);

// RentBird API endpoints
app.use('/api/preferences', preferencesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Public scraping schedule (no auth)
app.get('/api/scraping-schedule', (req, res) => {
  try {
    const status = scrapeRunner.getStatus();
    // Return a minimal, non-sensitive subset
    const minimal = {
      enabled: status.enabled,
      everyMinutes: status.everyMinutes,
      timesPerDay: status.timesPerDay,
      lastTriggeredAt: status.lastTriggeredAt,
      nextPlannedAt: status.nextPlannedAt,
      sources: status.sources,
      maxPerCity: status.maxPerCity,
    };
    res.json({ success: true, schedule: minimal });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to read schedule' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Fyxed Wonen API Server' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
