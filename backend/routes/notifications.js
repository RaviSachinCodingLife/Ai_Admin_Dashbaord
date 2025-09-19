// routes/notifications.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';

export default (io) => {
  const router = express.Router();

  // Get all notifications
  router.get('/', protect(), async (req, res) => {
    const notes = await Notification.find().sort({ createdAt: -1 });
    res.json(notes);
  });

  // Add notification
  router.post('/', protect(['admin', 'manager']), async (req, res) => {
    const note = new Notification({ message: req.body.message });
    await note.save();

    // ✅ Emit notification to all clients
    io.emit('notification:new', note);

    res.json(note);
  });

  return router;
};
