const User = require('../models/User');

const subscriptionGuard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('subscription');
    if (!user || user.subscription?.status !== 'active') {
      return res.status(402).json({ error: 'Actief abonnement vereist' });
    }
    next();
  } catch (e) {
    console.error('subscriptionGuard error:', e.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { subscriptionGuard };

