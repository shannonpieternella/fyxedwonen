const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  verhuurderEmail: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  verhuurderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  // Who sent this message: 'user' or 'verhuurder'
  senderType: {
    type: String,
    enum: ['user', 'verhuurder'],
    required: true
  },
  // Conversation thread ID (propertyId_userEmail_verhuurderEmail)
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  // Read status per participant
  readBy: {
    user: {
      type: Boolean,
      default: false
    },
    verhuurder: {
      type: Boolean,
      default: false
    }
  },
  // Legacy fields for backward compatibility
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['sent', 'read', 'replied'],
    default: 'sent'
  }
}, {
  timestamps: true
});

// Index for efficient conversation queries
messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);