const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });
const { sendWelcomeEmail } = require('./utils/emailService');

// Test welcome email sending
async function testWelcomeEmail() {
  const testEmail = process.argv[2] || 'pieternellashannon@gmail.com';
  const testName = process.argv[3] || 'Shannon';

  console.log('🔍 Testing welcome email...\n');
  console.log('  To:', testEmail);
  console.log('  Name:', testName);
  console.log('\n');

  try {
    const result = await sendWelcomeEmail(testEmail, testName, 'user');
    console.log('\n✅ Welcome email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('\n🎉 Test passed! Check your inbox.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testWelcomeEmail();
