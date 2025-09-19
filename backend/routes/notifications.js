import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';

export default (io) => {
  const router = express.Router();

  // Get last 20 notifications
  router.get('/', protect(), async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create notification (admin & manager only)
  router.post('/', protect(['admin', 'manager']), async (req, res) => {
    try {
      const { message, type = 'info' } = req.body;
      if (!message) return res.status(400).json({ error: 'Message required' });

      const note = new Notification({ message, type });
      await note.save();

      io.emit('notification:new', note); // broadcast to all clients
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
