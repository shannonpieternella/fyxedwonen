const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter using Zoho Mail credentials from .env
const createTransporter = () => {
  const isSecure = process.env.EMAIL_SECURE === 'true';
  const port = parseInt(process.env.EMAIL_PORT);

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: isSecure, // true for 465 (SSL), false for 587 (STARTTLS)
    requireTLS: !isSecure, // Use STARTTLS for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
      ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4'
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 15000      // 15 seconds
  });
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userType = 'user') => {
  try {
    console.log('[EmailService] Starting password reset email send...');
    console.log('[EmailService] Target email:', email);
    console.log('[EmailService] User type:', userType);
    console.log('[EmailService] Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM
    });

    const transporter = createTransporter();

    // Verify SMTP connection (using port 587 which works on Hetzner)
    try {
      await transporter.verify();
      console.log('[EmailService] SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('[EmailService] SMTP verification failed:', verifyError.message);
      // Continue anyway - we'll catch errors during send
    }

    // Determine frontend base URL
    const appBaseUrl = process.env.APP_BASE_URL || 'https://fyxedwonen.nl';
    // Create reset URL based on user type
    const resetUrl = userType === 'verhuurder'
      ? `${appBaseUrl}/verhuurders/reset-password?token=${resetToken}`
      : `${appBaseUrl}/reset-password?token=${resetToken}`;

    console.log('[EmailService] Reset URL:', resetUrl);

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Wachtwoord Reset - Fyxed Wonen',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #38b6ff, #2196f3);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #38b6ff;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Wachtwoord Reset</h1>
            </div>
            <div class="content">
              <p>Hallo,</p>
              <p>Je hebt een wachtwoord reset aangevraagd voor je Fyxed Wonen account.</p>
              <p>Klik op de onderstaande knop om je wachtwoord opnieuw in te stellen:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Wachtwoord Resetten</a>
              </div>

              <p>Of kopieer deze link in je browser:</p>
              <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>

              <div class="warning">
                <strong>⚠️ Belangrijk:</strong> Deze link is 1 uur geldig. Als je deze verzoek niet hebt gedaan, kun je deze e-mail negeren.
              </div>

              <p>Met vriendelijke groet,<br>
              Het Fyxed Wonen Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Fyxed Wonen. Alle rechten voorbehouden.</p>
              <p>Deze e-mail is verstuurd naar ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('[EmailService] Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] ✓ Password reset email sent successfully!');
    console.log('[EmailService] Message ID:', info.messageId);
    console.log('[EmailService] Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] ✗ Error sending password reset email:');
    console.error('[EmailService] Error type:', error.name);
    console.error('[EmailService] Error message:', error.message);
    console.error('[EmailService] Error code:', error.code);
    if (error.response) {
      console.error('[EmailService] Server response:', error.response);
    }
    if (error.command) {
      console.error('[EmailService] Failed command:', error.command);
    }
    throw error;
  }
};

module.exports = {
  generateResetToken,
  sendPasswordResetEmail
};
