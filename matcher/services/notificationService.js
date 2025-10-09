const Match = require('../models/Match');
const User = require('../models/User');
const Property = require('../models/Property');
const Analytics = require('../models/Analytics');
const { sendMatchNotification } = require('../utils/emailService');

module.exports = {
  async sendBatchNotifications(matches) {
    if (!matches || !matches.length) return;
    // Global gates to reduce low-quality emails
    const allowedSources = (process.env.NOTIFY_SOURCES || '').split(',').map(s=>s.trim()).filter(Boolean);
    const minImages = Math.max(0, parseInt(process.env.NOTIFY_MIN_IMAGES || '0', 10));
    const blocklist = (process.env.NOTIFY_IMAGE_BLOCKLIST || '').split(',').map(s=>s.trim()).filter(Boolean);
    const MAX_PER_USER = parseInt(process.env.MATCH_MAX_INSTANT_PER_BATCH || '3', 10);
    const byUser = new Map();
    for (const m of matches) {
      const key = String(m.user);
      if (!byUser.has(key)) byUser.set(key, []);
      byUser.get(key).push(m);
    }
    const toSend = [];
    for (const [_, arr] of byUser.entries()) {
      const sorted = arr.sort((a,b)=>{
        const rank = (hc)=> hc==='high'?2:hc==='medium'?1:0;
        const r = rank((b.hireChance||'medium')) - rank((a.hireChance||'medium'));
        if (r!==0) return r;
        if ((b.score||0)!==(a.score||0)) return (b.score||0)-(a.score||0);
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
      });
      toSend.push(...sorted.slice(0, Math.max(0, MAX_PER_USER)));
    }
    for (const match of toSend) {
      try {
        await match.populate('user property');
        const user = match.user;
        const property = match.property;
        if (property?.approvalStatus && property.approvalStatus !== 'approved') continue;
        if (property?.isArchived === true || property?.isStillAvailable === false) continue;
        if (allowedSources.length && !allowedSources.includes(property?.source)) continue;
        if (minImages > 0) {
          const num = Array.isArray(property?.images) ? property.images.length : 0;
          if (num < minImages) continue;
        }
        if (blocklist.length && Array.isArray(property?.images) && property.images.length) {
          const bad = property.images.some(url => blocklist.some(b => url.includes(b)));
          if (bad) continue;
        }
        if (!user?.notifications?.email) continue;
        if (user.notifications.frequency !== 'instant') continue;
        await sendMatchNotification(user, match, property);
        match.status = 'notified';
        match.notifiedAt = new Date();
        match.notificationSent = true;
        await match.save();
        await Analytics.increment('notifications.emailsSent');
      } catch (e) {
        await Analytics.increment('notifications.emailsFailed');
      }
    }
  }
};
