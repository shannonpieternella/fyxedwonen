const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');

// Initialize Stripe with fallback for demo
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('demo')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.log('Stripe not configured - using demo mode');
}

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planName, price, userEmail } = req.body;

    // Ensure we have a valid email
    const validEmail = userEmail && userEmail.trim() !== '' ? userEmail : 'demo@fyxedwonen.nl';

    // If Stripe is not configured, return demo session without external URL
    if (!stripe) {
      const demoSession = {
        id: 'demo_session_' + Date.now(),
        // Don't use external demo URL, let frontend handle demo mode
      };
      return res.json({ sessionId: demoSession.id, demo: true });
    }

    // derive base URL (local vs prod)
    const detectedOrigin = (req.headers.origin || '').toString();
    const hostHeader = (req.headers.host || '').toString();
    const devOverride = process.env.DEV_BASE_URL; // optional
    const isLocalOrigin = /localhost|127\.0\.0\.1/.test(detectedOrigin);
    const isLocalHost = /localhost|127\.0\.0\.1/.test(hostHeader);
    const appBaseUrl = devOverride
      ? devOverride
      : (isLocalOrigin || isLocalHost)
        ? (detectedOrigin || 'http://localhost:3000')
        : (process.env.APP_BASE_URL || detectedOrigin || 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: planName || 'Fyxed Wonen Premium',
              description: 'Toegang tot alle huurwoningen en premium functies',
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appBaseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/payment`,
      customer_email: validEmail,
      billing_address_collection: 'required',
      metadata: {
        planName: planName,
        price: price.toString(),
        userEmail: validEmail
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    // Fallback to demo mode without external URL
    const demoSession = {
      id: 'demo_session_' + Date.now(),
    };
    res.json({ sessionId: demoSession.id, demo: true });
  }
});

// Verify payment status
router.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Handle demo sessions
    if (sessionId.startsWith('demo_session_')) {
      // For demo mode, try to find user from tempUserData or send to demo email
      // This is a fallback - in production demo would have real user email
      return res.json({
        status: 'paid',
        customer_email: 'demo@fyxedwonen.nl',
        metadata: {
          planName: 'Demo Plan',
          price: '29.95',
          userEmail: 'demo@fyxedwonen.nl'
        }
      });
    }

    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If payment is successful, send welcome email
    if (session.payment_status === 'paid' && session.customer_email) {
      try {
        // Find user by email to get first name
        const user = await User.findOne({ email: session.customer_email.toLowerCase() });

        if (user) {
          // Only send welcome email if not already sent
          if (!user.welcomeEmailSent) {
            // Send welcome email asynchronously (don't wait for it)
            sendWelcomeEmail(user.email, user.firstName, 'user')
              .then(async () => {
                console.log('[Stripe] Welcome email sent to:', user.email);
                // Mark welcome email as sent
                try {
                  await User.updateOne(
                    { _id: user._id },
                    { welcomeEmailSent: true, paymentCompleted: true }
                  );
                } catch (updateErr) {
                  console.error('[Stripe] Failed to update welcomeEmailSent flag:', updateErr.message);
                }
              })
              .catch((mailErr) => console.error('[Stripe] Welcome email failed:', mailErr?.message));
          } else {
            console.log('[Stripe] Welcome email already sent to:', user.email);
            // Still mark payment as completed
            try {
              await User.updateOne({ _id: user._id }, { paymentCompleted: true });
            } catch (updateErr) {
              console.error('[Stripe] Failed to update paymentCompleted flag:', updateErr.message);
            }
          }
        } else {
          console.log('[Stripe] User not found for email:', session.customer_email);
        }
      } catch (error) {
        console.error('[Stripe] Error looking up user for welcome email:', error.message);
        // Don't fail the payment verification because of email issues
      }
    }

    res.json({
      status: session.payment_status,
      customer_email: session.customer_email,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
