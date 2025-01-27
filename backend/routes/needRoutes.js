import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createNeed,
  getNeeds,
  getNeedById,
  addComment,
  updateNeedStatus
} from '../controllers/needController.js';

const router = express.Router();

// Public routes
router.get('/', getNeeds);
router.get('/:id', getNeedById);

// Protected routes
router.post('/', protect, createNeed);
router.post('/:id/comments', protect, addComment);
router.put('/:id/status', protect, updateNeedStatus);

export default router; 