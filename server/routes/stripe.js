const express = require('express');
const router = express.Router();

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
      success_url: `${req.headers.origin || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/payment`,
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