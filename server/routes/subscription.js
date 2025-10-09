const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Initialize Stripe
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('demo')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.log('Stripe not configured - using demo mode');
}

// RentBird pricing configuration
const PRICING_TIERS = {
  '1_month': {
    name: '1 Maand',
    price: 29,
    duration: 1,
    discount: 0,
    stripePriceId: process.env.STRIPE_PRICE_1_MONTH // Set in .env
  },
  '2_months': {
    name: '2 Maanden',
    price: 39, // €19.50 per month
    duration: 2,
    discount: 32,
    stripePriceId: process.env.STRIPE_PRICE_2_MONTHS
  },
  '3_months': {
    name: '3 Maanden',
    price: 49, // €16.33 per month
    duration: 3,
    discount: 44,
    stripePriceId: process.env.STRIPE_PRICE_3_MONTHS
  }
};

// Get current subscription status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription');

    res.json({
      success: true,
      subscription: user.subscription || {
        tier: null,
        status: 'inactive'
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pricing tiers
router.get('/pricing', async (req, res) => {
  try {
    res.json({
      success: true,
      tiers: PRICING_TIERS
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Stripe Checkout Session for subscription
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    const { tier } = req.body;

    if (!tier || !PRICING_TIERS[tier]) {
      return res.status(400).json({ error: 'Invalid pricing tier' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Demo mode fallback
    if (!stripe) {
      return res.json({
        sessionId: 'demo_session_' + Date.now(),
        demo: true
      });
    }

    const pricing = PRICING_TIERS[tier];
    // Compute appBaseUrl robustly for local dev
    const detectedOrigin = (req.headers.origin || '').toString();
    const hostHeader = (req.headers.host || '').toString();
    const devOverride = process.env.DEV_BASE_URL; // optional explicit override, e.g. http://localhost:3000
    const isLocalOrigin = /localhost|127\.0\.0\.1/.test(detectedOrigin);
    const isLocalHost = /localhost|127\.0\.0\.1/.test(hostHeader);
    const appBaseUrl = devOverride
      ? devOverride
      : (isLocalOrigin || isLocalHost)
        ? (detectedOrigin || 'http://localhost:3000')
        : (process.env.APP_BASE_URL || detectedOrigin || 'http://localhost:3000');

    // Create or retrieve Stripe customer
    let customerId = user.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;

      // Save customer ID
      await User.updateOne(
        { _id: user._id },
        { 'subscription.stripeCustomerId': customerId }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Fyxed Wonen - ${pricing.name}`,
              description: `AI-powered woning matching voor ${pricing.duration} maand${pricing.duration > 1 ? 'en' : ''}`,
            },
            unit_amount: pricing.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment for the period
      success_url: `${appBaseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/subscription`,
      metadata: {
        userId: user._id.toString(),
        tier: tier,
        duration: pricing.duration.toString()
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment and activate subscription
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // Handle demo mode
    if (sessionId.startsWith('demo_session_')) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          'subscription.tier': '1_month',
          'subscription.status': 'active',
          'subscription.startDate': new Date(),
          'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        { new: true }
      ).select('subscription');

      return res.json({
        success: true,
        message: 'Demo subscription activated',
        subscription: user.subscription
      });
    }

    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    // Retrieve session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Extract metadata
    const { userId, tier, duration } = session.metadata;

    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(duration));

    // Update user subscription
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'subscription.tier': tier,
        'subscription.status': 'active',
        'subscription.startDate': startDate,
        'subscription.endDate': endDate,
        'subscription.stripeSubscriptionId': session.id,
        'paymentCompleted': true
      },
      { new: true }
    ).select('subscription');

    res.json({
      success: true,
      message: 'Subscription activated',
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Cancel subscription
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.subscription.status !== 'active') {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Mark subscription as cancelled (but keep active until end date)
    await User.updateOne(
      { _id: user._id },
      {
        'subscription.cancelAtPeriodEnd': true
      }
    );

    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current period',
      endDate: user.subscription.endDate
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Stripe webhook endpoint (for handling subscription events)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(400).send('Webhook not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);

      // Subscription activation is handled in verify-payment endpoint
      break;

    case 'customer.subscription.deleted':
      // Subscription ended
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Find user and deactivate subscription
      await User.updateOne(
        { 'subscription.stripeCustomerId': customerId },
        {
          'subscription.status': 'inactive',
          'subscription.endDate': new Date()
        }
      );

      console.log('Subscription deleted for customer:', customerId);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
