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

const maybeLogAndBypassSend = async (mailOptions, context = 'email') => {
  if (process.env.EMAIL_MODE === 'log') {
    console.log(`[EmailService] EMAIL_MODE=log → skipping send (${context})`);
    console.log('[EmailService] To:', mailOptions.to);
    console.log('[EmailService] Subject:', mailOptions.subject);
    if (mailOptions.html) {
      console.log('[EmailService] HTML preview (first 400 chars):');
      console.log(String(mailOptions.html).slice(0, 400) + '...');
    }
    return { success: true, messageId: 'log-mode' };
  }
  return null;
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
    const bypass = await maybeLogAndBypassSend(mailOptions, 'reset');
    if (bypass) return bypass;
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
    const bypass = await maybeLogAndBypassSend(mailOptions, 'welcome');
    if (bypass) return bypass;
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

// Send match notification email
const sendMatchNotification = async (user, match, property) => {
  try {
    console.log('[EmailService] Starting match notification email send...');
    console.log('[EmailService] Target email:', user.email);
    console.log('[EmailService] Match score:', match.score);

    const transporter = createTransporter();

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('[EmailService] SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('[EmailService] SMTP verification failed:', verifyError.message);
    }

    const appBaseUrl = process.env.APP_BASE_URL || 'https://fyxedwonen.nl';
    const matchUrl = `${appBaseUrl}/matches/${match._id}`;

    // Format price
    const formattedPrice = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(property.price);

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: `🏠 Nieuwe Match: ${property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #38b6ff, #2196f3);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .match-score {
              background: rgba(255, 255, 255, 0.2);
              display: inline-block;
              padding: 10px 20px;
              border-radius: 20px;
              margin-top: 10px;
              font-size: 18px;
              font-weight: bold;
            }
            .content {
              padding: 30px;
            }
            .property-image {
              width: 100%;
              height: 300px;
              object-fit: cover;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .property-title {
              font-size: 22px;
              color: #2196f3;
              margin: 0 0 15px 0;
            }
            .property-details {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: bold;
              color: #666;
            }
            .detail-value {
              color: #333;
            }
            .match-reasons {
              background: #e3f2fd;
              border-left: 4px solid #2196f3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .match-reasons h3 {
              margin: 0 0 10px 0;
              color: #1976d2;
              font-size: 16px;
            }
            .match-reasons ul {
              margin: 0;
              padding-left: 20px;
            }
            .match-reasons li {
              margin: 5px 0;
              color: #555;
            }
            .button {
              display: inline-block;
              padding: 15px 40px;
              background: #38b6ff;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .button:hover {
              background: #2196f3;
            }
            .secondary-button {
              display: inline-block;
              padding: 12px 30px;
              background: white;
              color: #2196f3;
              text-decoration: none;
              border: 2px solid #2196f3;
              border-radius: 8px;
              margin: 10px 5px;
              font-weight: bold;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .footer {
              background: #f5f5f5;
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .urgency-badge {
              background: #ff9800;
              color: white;
              padding: 8px 15px;
              border-radius: 20px;
              display: inline-block;
              font-size: 14px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nieuwe Woning Match!</h1>
              <div class="match-score">${match.score}% Match</div>
            </div>

            <div class="content">
              ${property.images && property.images.length > 0
                ? `<img src="${property.images[0]}" alt="${property.title}" class="property-image" onerror="this.style.display='none'">`
                : ''}

              <div class="urgency-badge">⚡ Wees er snel bij!</div>

              <h2 class="property-title">${property.title}</h2>

              <div class="property-details">
                <div class="detail-row">
                  <span class="detail-label">📍 Locatie</span>
                  <span class="detail-value">${property.address.city}${property.address.street ? `, ${property.address.street}` : ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">💰 Huur per maand</span>
                  <span class="detail-value">${formattedPrice}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">📏 Oppervlakte</span>
                  <span class="detail-value">${property.size} m²</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🚪 Kamers</span>
                  <span class="detail-value">${property.rooms}</span>
                </div>
                ${property.furnished !== undefined
                  ? `<div class="detail-row">
                      <span class="detail-label">🛋️ Gemeubileerd</span>
                      <span class="detail-value">${property.furnished ? 'Ja' : 'Nee'}</span>
                    </div>`
                  : ''}
              </div>

              ${match.matchReasons && match.matchReasons.length > 0
                ? `<div class="match-reasons">
                    <h3>✨ Waarom deze woning bij jou past:</h3>
                    <ul>
                      ${match.matchReasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                  </div>`
                : ''}

              <div class="button-container">
                <a href="${matchUrl}" class="button">Bekijk Match Details</a>
                <br>
                <a href="${property.sourceUrl}" class="secondary-button" target="_blank">Direct naar ${property.source.charAt(0).toUpperCase() + property.source.slice(1)}</a>
              </div>

              <p style="color: #ff9800; font-weight: bold; text-align: center;">
                💡 Tip: Reageer binnen 15 minuten voor 4x meer kans op een bezichtiging!
              </p>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Deze woning is gevonden op <strong>${property.source}</strong> en matcht ${match.score}% met jouw voorkeuren.
              </p>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Fyxed Wonen. Alle rechten voorbehouden.</p>
              <p>Deze e-mail is verstuurd naar ${user.email}</p>
              <p style="margin-top: 10px;">
                <a href="${appBaseUrl}/preferences" style="color: #2196f3; text-decoration: none;">Voorkeuren aanpassen</a> |
                <a href="${appBaseUrl}/subscription" style="color: #2196f3; text-decoration: none;">Abonnement beheren</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('[EmailService] Sending match notification email...');
    const bypass = await maybeLogAndBypassSend(mailOptions, 'match');
    if (bypass) return bypass;
    const info = await transporter.sendMail(mailOptions);
    console.log('[EmailService] ✓ Match notification email sent successfully!');
    console.log('[EmailService] Message ID:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] ✗ Error sending match notification email:');
    console.error('[EmailService] Error type:', error.name);
    console.error('[EmailService] Error message:', error.message);
    throw error;
  }
};

module.exports = {
  generateResetToken,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendMatchNotification
};
