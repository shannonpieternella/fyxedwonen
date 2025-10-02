const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

// Test SMTP connection
async function testSMTP() {
  console.log('🔍 Testing SMTP connection...\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.EMAIL_HOST);
  console.log('  Port:', process.env.EMAIL_PORT);
  console.log('  User:', process.env.EMAIL_USER);
  console.log('  Pass:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('  Secure:', process.env.EMAIL_SECURE);
  console.log('\n');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    requireTLS: process.env.EMAIL_SECURE !== 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      minVersion: 'TLSv1.2'
    },
    debug: true, // Enable debug output
    logger: true  // Log to console
  });

  try {
    console.log('📡 Verifying SMTP connection...\n');
    await transporter.verify();
    console.log('\n✅ SMTP connection verified successfully!\n');

    // Try sending a test email
    const testEmail = process.argv[2] || 'pieternellashannon@gmail.com';
    console.log(`📧 Sending test email to ${testEmail}...\n`);

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: testEmail,
      subject: 'Test Email - Fyxed Wonen SMTP',
      text: 'This is a test email from your Fyxed Wonen SMTP configuration.',
      html: `
        <h2>✅ SMTP Test Successful!</h2>
        <p>Your Zoho Mail SMTP configuration is working correctly.</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>Host: ${process.env.EMAIL_HOST}</li>
          <li>Port: ${process.env.EMAIL_PORT}</li>
          <li>From: ${process.env.EMAIL_FROM}</li>
        </ul>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n🎉 All tests passed! Your SMTP is working correctly.\n');

  } catch (error) {
    console.error('\n❌ SMTP Error:\n');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);

    if (error.response) {
      console.error('Server Response:', error.response);
    }

    console.error('\n🔧 Troubleshooting:');

    if (error.code === 'EAUTH') {
      console.error('  ❌ Authentication failed!');
      console.error('  → Check if your password is correct');
      console.error('  → If 2FA is enabled, create an App-Specific Password at:');
      console.error('     https://accounts.zoho.eu/home#security/application-passwords');
    } else if (error.code === 'ECONNECTION') {
      console.error('  ❌ Connection failed!');
      console.error('  → Check if SMTP is enabled in Zoho settings');
      console.error('  → Verify host and port are correct');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('  ❌ Connection timeout!');
      console.error('  → Check your internet connection');
      console.error('  → Verify firewall settings');
    }

    console.error('\n');
    process.exit(1);
  }
}

testSMTP();
