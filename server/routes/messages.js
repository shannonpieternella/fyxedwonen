const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Property = require('../models/Property');
const Verhuurder = require('../models/Verhuurder');

// Get conversations for a user
router.get('/user/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;

    // Get all conversations for this user (grouped by conversationId)
    const conversations = await Message.aggregate([
      {
        $match: {
          userEmail: userEmail
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          totalMessages: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$readBy.user', false] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get messages in a specific conversation
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send a reply in a conversation
router.post('/reply', async (req, res) => {
  try {
    const {
      conversationId,
      message,
      senderType,
      senderEmail,
      senderName
    } = req.body;

    // Validate required fields
    if (!conversationId || !message || !senderType || !senderEmail || !senderName) {
      return res.status(400).json({
        message: 'Alle velden zijn verplicht.'
      });
    }

    // Get conversation info from the first message
    const firstMessage = await Message.findOne({ conversationId }).sort({ createdAt: 1 });
    if (!firstMessage) {
      return res.status(404).json({
        message: 'Conversatie niet gevonden.'
      });
    }

    // Create reply message
    const replyMessage = new Message({
      propertyId: firstMessage.propertyId,
      verhuurderEmail: firstMessage.verhuurderEmail,
      verhuurderName: firstMessage.verhuurderName,
      userEmail: firstMessage.userEmail,
      userName: firstMessage.userName,
      message,
      propertyTitle: firstMessage.propertyTitle,
      senderType,
      conversationId,
      readBy: {
        user: senderType === 'user',
        verhuurder: senderType === 'verhuurder'
      },
      // Legacy fields
      isRead: false,
      status: 'sent'
    });

    await replyMessage.save();

    res.status(201).json({
      message: 'Bericht succesvol verzonden.',
      messageData: replyMessage
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark messages in a conversation as read
router.put('/conversation/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { readerType } = req.body; // 'user' or 'verhuurder'

    if (!readerType || !['user', 'verhuurder'].includes(readerType)) {
      return res.status(400).json({
        message: 'readerType moet "user" of "verhuurder" zijn.'
      });
    }

    // Mark all messages in conversation as read for this reader type
    const updateField = `readBy.${readerType}`;
    await Message.updateMany(
      {
        conversationId,
        [updateField]: false
      },
      {
        $set: {
          [updateField]: true,
          // Also update legacy isRead field for backward compatibility
          isRead: true,
          status: 'read'
        }
      }
    );

    res.json({ message: 'Berichten gemarkeerd als gelezen.' });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get conversations for a verhuurder (existing functionality but updated)
router.get('/verhuurder/:verhuurderEmail', async (req, res) => {
  try {
    const { verhuurderEmail } = req.params;

    // Get all conversations for this verhuurder (grouped by conversationId)
    const conversations = await Message.aggregate([
      {
        $match: {
          verhuurderEmail: verhuurderEmail
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          totalMessages: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$readBy.verhuurder', false] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching verhuurder conversations:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;