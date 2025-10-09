const path = require('path');
let mongoose;
try {
  const resolved = require.resolve('mongoose', { paths: [path.join(__dirname, '..', 'server')] });
  mongoose = require(resolved);
} catch (_) {
  mongoose = require('mongoose');
}

const MatchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  score: { type: Number, required: true },
  status: { type: String, enum: ['new', 'notified', 'viewed', 'interested', 'dismissed'], default: 'new' },
  notifiedAt: { type: Date },
  notificationSent: { type: Boolean, default: false },
  matchReasons: [{ type: String }],
  hireChance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
}, { timestamps: true });

MatchSchema.index({ user: 1, property: 1 }, { unique: true });
MatchSchema.index({ user: 1, status: 1 });
MatchSchema.index({ status: 1, notifiedAt: 1 });

module.exports = mongoose.models.Match || mongoose.model('Match', MatchSchema);
