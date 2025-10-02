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

// Send welcome email after successful registration and payment
const sendWelcomeEmail = async (email, firstName, userType = 'user') => {
  try {
    console.log('[EmailService] Starting welcome email send...');
    console.log('[EmailService] Target email:', email);
    console.log('[EmailService] First name:', firstName);
    console.log('[EmailService] User type:', userType);

    const transporter = createTransporter();

    // Verify SMTP connection (using port 587 which works on Hetzner)
    try {
      await transporter.verify();
      console.log('[EmailService] SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('[EmailService] SMTP verification failed:', verifyError.message);
      // Continue anyway - we'll catch errors during send
    }

    const appBaseUrl = process.env.APP_BASE_URL || 'https://fyxedwonen.nl';
    const dashboardUrl = userType === 'verhuurder'
      ? `${appBaseUrl}/verhuurders/dashboard`
      : `${appBaseUrl}/dashboard`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welkom bij Fyxed Wonen! 🎉',
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
              padding: 40px 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .welcome-icon {
              font-size: 64px;
              text-align: center;
              margin: 20px 0;
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
              text-align: center;
            }
            .features {
              background: white;
              border-left: 4px solid #38b6ff;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .features ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .features li {
              margin: 8px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welkom bij Fyxed Wonen!</h1>
            </div>
            <div class="content">
              <div class="welcome-icon">🎉</div>

              <p>Hallo ${firstName},</p>

              <p><strong>Bedankt voor je registratie en betaling!</strong></p>

              <p>We zijn verheugd je te verwelkomen bij Fyxed Wonen. Je account is nu geactiveerd en je hebt volledige toegang tot ons platform.</p>

              <div class="features">
                <h3 style="margin-top: 0; color: #38b6ff;">✨ Wat kun je nu doen?</h3>
                <ul>
                  <li>🏠 Zoek door duizenden huurwoningen in heel Nederland</li>
                  <li>💙 Sla je favoriete woningen op</li>
                  <li>📧 Neem direct contact op met verhuurders</li>
                  <li>🔔 Ontvang meldingen over nieuwe woningen</li>
                  <li>⚡ Gebruik premium filters voor je ideale woning</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Ga naar je Dashboard</a>
              </div>

              <p style="margin-top: 30px;">Als je vragen hebt of hulp nodig hebt, aarzel dan niet om contact met ons op te nemen.</p>

              <p>Veel succes met het vinden van je droomwoning!</p>

              <p>Met vriendelijke groet,<br>
              <strong>Het Fyxed Wonen Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Fyxed B.V. Alle rechten voorbehouden.</p>
              <p>Deze e-mail is verstuurd naar ${email}</p>
              <p style="margin-top: 10px;">
                <a href="${appBaseUrl}" style="color: #38b6ff; text-decoration: none;">fyxedwonen.nl</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('[EmailService] Sending welcome email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] ✓ Welcome email sent successfully!');
    console.log('[EmailService] Message ID:', info.messageId);
    console.log('[EmailService] Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] ✗ Error sending welcome email:');
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
  sendPasswordResetEmail,
  sendWelcomeEmail
};
