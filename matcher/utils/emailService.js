const nodemailer = require('nodemailer');

const createTransporter = () => {
  const isSecure = process.env.EMAIL_SECURE === 'true';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: isSecure,
    requireTLS: !isSecure,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });
};

async function sendMatchNotification(user, match, property) {
  const transporter = createTransporter();
  const appBaseUrl = process.env.APP_BASE_URL || 'https://fyxedwonen.nl';
  const url = property.sourceUrl || `${appBaseUrl}/woning/${property._id}`;
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Fyxed Wonen'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Nieuwe match: ${property.title || property.address?.city || 'Woning'}`,
    html: `<p>Hi ${user.firstName || ''},</p><p>We vonden een nieuwe woningmatch voor je in ${property.address?.city || ''}.</p><p><a href="${url}">Bekijk woning</a></p>`
  };
  if (process.env.EMAIL_MODE === 'log') {
    console.log('[matcher email] log mode:', mailOptions);
    return { messageId: 'log-mode' };
  }
  await transporter.verify().catch(()=>{});
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMatchNotification };

