const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateResetToken, sendPasswordResetEmail } = require('../utils/emailService');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    const savedUser = await user.save();

    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'E-mailadres is verplicht' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        message: 'Als dit e-mailadres bestaat, ontvang je een reset link.'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();

    // Save token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email (do not reveal failures to client)
    try {
      await sendPasswordResetEmail(email, resetToken, 'user');
    } catch (mailErr) {
      console.error('sendPasswordResetEmail failed:', mailErr?.message || mailErr);
      // Continue with generic success response to avoid user enumeration/leakage
    }

    res.json({
      message: 'Als dit e-mailadres bestaat, ontvang je een reset link.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Always respond generically to avoid leaking whether address exists
    res.json({
      message: 'Als dit e-mailadres bestaat, ontvang je een reset link.'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token en nieuw wachtwoord zijn verplicht'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Wachtwoord moet minimaal 6 karakters lang zijn'
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is ongeldig of verlopen'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Wachtwoord succesvol gewijzigd' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Er is een fout opgetreden bij het resetten van je wachtwoord'
    });
  }
});

module.exports = router;
