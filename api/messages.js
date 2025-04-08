const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages between two users
router.get('/:sender/:receiver', async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Save new message
router.post('/', async (req, res) => {
  const { sender, receiver, text } = req.body;
  try {
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error saving message' });
  }
});

module.exports = router;
