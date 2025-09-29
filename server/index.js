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

// Connect to MongoDB
connectDB();

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const stripeRoutes = require('./routes/stripe');
const verhuurderRoutes = require('./routes/verhuurders');
const messageRoutes = require('./routes/messages');

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/verhuurders', verhuurderRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Fyxed Wonen API Server' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});