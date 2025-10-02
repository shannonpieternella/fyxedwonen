const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter using Zoho Mail credentials from .env
const createTransporter = () => {
  return nodemailer.createTransport({
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
    }
  });
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userType = 'user') => {
  try {
    const transporter = createTransporter();

    // Determine frontend base URL
    const appBaseUrl = process.env.APP_BASE_URL || 'https://fyxedwonen.nl';
    // Create reset URL based on user type
    const resetUrl = userType === 'verhuurder'
      ? `${appBaseUrl}/verhuurders/reset-password?token=${resetToken}`
      : `${appBaseUrl}/reset-password?token=${resetToken}`;

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

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  generateResetToken,
  sendPasswordResetEmail
};
