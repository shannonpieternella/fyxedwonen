// Test script for matching algorithm
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
const matchingService = require('./services/matchingService');

async function testMatching() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find our test user
    const user = await User.findOne({ email: 'test@rentbird.nl' });
    if (!user) {
      console.log('❌ Test user not found!');
      process.exit(1);
    }

    // Activate subscription for testing
    user.subscription.status = 'active';
    user.subscription.tier = '1_month';
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    console.log('✅ Test user found:',user.email);
    console.log('   Subscription:', user.subscription.status);
    console.log('   Preferences:', user.preferences);
    console.log('');

    // Create test property that matches user preferences
    const testProperty = new Property({
      title: 'Modern Apartment in Amsterdam Centrum',
      address: {
        street: 'Keizersgracht 123',
        city: 'Amsterdam',
        postalCode: '1015CJ',
        country: 'Netherlands'
      },
      price: 1200, // Within 800-1500 range
      size: 75, // Within 50-100 range
      rooms: 3, // >= 2
      bedrooms: 2,
      description: 'Beautiful modern apartment in the heart of Amsterdam',
      images: ['https://example.com/image1.jpg'],
      features: ['Modern kitchen', 'Central location'],
      furnished: false,
      petsAllowed: false,
      balcony: true, // User wants balcony
      parking: true, // User wants parking
      garden: false,

      // Scraping metadata
      source: 'pararius',
      sourceUrl: 'https://www.pararius.nl/test-property',
      sourceId: 'test-123',
      scrapedAt: new Date(),
      lastCheckedAt: new Date(),
      isStillAvailable: true,
      approvalStatus: 'approved'
    });

    await testProperty.save();
    console.log('✅ Test property created:', testProperty.title);
    console.log('   City:', testProperty.address.city);
    console.log('   Price: €' + testProperty.price);
    console.log('   Size:', testProperty.size + 'm²');
    console.log('   Rooms:', testProperty.rooms);
    console.log('');

    // Test matching algorithm
    console.log('🔍 Running matching algorithm...\n');
    const matches = await matchingService.findMatchesForProperty(testProperty);

    console.log('\n📊 MATCHING RESULTS:');
    console.log('   Matches created:', matches.length);

    if (matches.length > 0) {
      const match = matches[0];
      console.log('\n   Match details:');
      console.log('   - Score:', match.score + '%');
      console.log('   - Status:', match.status);
      console.log('   - Reasons:', match.matchReasons.join(', '));
      console.log('   - Notification sent:', match.notificationSent);
    }

    console.log('\n✅ Test completed successfully!\n');

    // Cleanup - keep the property for frontend testing
    // await testProperty.remove();

    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testMatching();
