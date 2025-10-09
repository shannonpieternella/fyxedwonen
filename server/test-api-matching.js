// Test API matching for existing property
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
const matchingService = require('./services/matchingService');

async function testAPIMatching() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the API test user
    const user = await User.findOne({ email: 'apitest@rentbird.nl' });
    if (!user) {
      console.log('❌ API test user not found!');
      process.exit(1);
    }

    // Activate subscription for this user
    user.subscription.status = 'active';
    user.subscription.tier = '1_month';
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    console.log('✅ API test user:', user.email);
    console.log('   Subscription:', user.subscription.status);
    console.log('   Preferences:', user.preferences);
    console.log('');

    // Find the test property
    const testProperty = await Property.findOne({
      title: 'Modern Apartment in Amsterdam Centrum'
    });

    if (!testProperty) {
      console.log('❌ Test property not found!');
      process.exit(1);
    }

    console.log('✅ Found test property:', testProperty.title);
    console.log('');

    // Run matching for this property
    console.log('🔍 Running matching algorithm...\n');
    const matches = await matchingService.findMatchesForProperty(testProperty);

    console.log('📊 MATCHING RESULTS:');
    console.log('   Matches created:', matches.length);

    if (matches.length > 0) {
      matches.forEach((match, i) => {
        console.log(`\n   Match ${i + 1}:`);
        console.log('   - Score:', match.score + '%');
        console.log('   - Status:', match.status);
        console.log('   - Reasons:', match.matchReasons.join(', '));
        console.log('   - Notification sent:', match.notificationSent);
      });
    }

    console.log('\n✅ Test completed successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAPIMatching();
