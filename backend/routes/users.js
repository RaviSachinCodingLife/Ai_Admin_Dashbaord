import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect(['admin']), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete a user (Admin only)
router.delete('/:id', protect(['admin']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

export default router;
