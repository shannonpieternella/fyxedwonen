const mongoose = require('mongoose');
require('dotenv').config();

// Import the Property model
const Property = require('./models/Property');

// Mock data for Arnhem properties
const mockProperties = [
  {
    title: "Te huur: Huis Van Slichtenhorststraat in Arnhem",
    address: {
      street: "Van Slichtenhorststraat 12",
      city: "Arnhem",
      postalCode: "6821 CK",
      country: "Netherlands"
    },
    price: 1650,
    size: 109,
    rooms: 5,
    bedrooms: 3,
    yearBuilt: 1970,
    energyLabel: "C",
    description: "Ruime woning met moderne voorzieningen in rustige buurt van Arnhem.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ],
    features: ["Tuin", "Parkeerplaats", "Balkon"],
    furnished: false,
    petsAllowed: true,
    garden: true,
    parking: true,
    balcony: true,
    contact: {
      name: "Fyxed Wonen",
      email: "info@fyxedwonen.nl",
      phone: "+31 26 123 4567"
    },
    isActive: true
  },
  {
    title: "Te huur: Appartement Velperweg",
    address: {
      street: "Velperweg 89",
      city: "Arnhem",
      postalCode: "6824 HH",
      country: "Netherlands"
    },
    price: 1995,
    size: 100,
    rooms: 3,
    bedrooms: 2,
    yearBuilt: 2007,
    energyLabel: "B",
    description: "Modern appartement met prachtig uitzicht over de stad.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
    ],
    features: ["Lift", "Balkon", "Moderne keuken"],
    furnished: true,
    petsAllowed: false,
    garden: false,
    parking: false,
    balcony: true,
    contact: {
      name: "Fyxed Wonen",
      email: "info@fyxedwonen.nl",
      phone: "+31 26 123 4567"
    },
    isActive: true
  },
  {
    title: "Te huur: Appartement Eusebiusplein in Arnhem",
    address: {
      street: "Eusebiusplein 45",
      city: "Arnhem",
      postalCode: "6811 HE",
      country: "Netherlands"
    },
    price: 990,
    size: 99,
    rooms: 3,
    bedrooms: 2,
    yearBuilt: 1910,
    energyLabel: "D",
    description: "Karakteristiek appartement in het centrum van Arnhem.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    features: ["Centrum locatie", "Hoge plafonds", "Originele details"],
    furnished: false,
    petsAllowed: true,
    garden: false,
    parking: false,
    balcony: false,
    contact: {
      name: "Fyxed Wonen",
      email: "info@fyxedwonen.nl",
      phone: "+31 26 123 4567"
    },
    isActive: true
  },
  {
    title: "Te huur: Rijtjeshuis Bergstraat",
    address: {
      street: "Bergstraat 78",
      city: "Arnhem",
      postalCode: "6811 LR",
      country: "Netherlands"
    },
    price: 1350,
    size: 85,
    rooms: 4,
    bedrooms: 2,
    yearBuilt: 1955,
    energyLabel: "C",
    description: "Gezellige rijtjeswoning met tuin in groene omgeving.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    features: ["Tuin", "Rustige straat", "Dichtbij openbaar vervoer"],
    furnished: false,
    petsAllowed: true,
    garden: true,
    parking: true,
    balcony: false,
    contact: {
      name: "Fyxed Wonen",
      email: "info@fyxedwonen.nl",
      phone: "+31 26 123 4567"
    },
    isActive: true
  },
  {
    title: "Te huur: Studio Rijnstraat",
    address: {
      street: "Rijnstraat 234",
      city: "Arnhem",
      postalCode: "6812 BR",
      country: "Netherlands"
    },
    price: 750,
    size: 45,
    rooms: 1,
    bedrooms: 1,
    yearBuilt: 1980,
    energyLabel: "C",
    description: "Compacte studio ideaal voor student of starter.",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
    ],
    features: ["Compact", "Centrum", "Studentvriendelijk"],
    furnished: true,
    petsAllowed: false,
    garden: false,
    parking: false,
    balcony: false,
    contact: {
      name: "Fyxed Wonen",
      email: "info@fyxedwonen.nl",
      phone: "+31 26 123 4567"
    },
    isActive: true
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Property.deleteMany({});
    console.log('🗑️ Cleared existing properties');

    // Insert mock data
    const insertedProperties = await Property.insertMany(mockProperties);
    console.log(`✅ Inserted ${insertedProperties.length} mock properties`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();