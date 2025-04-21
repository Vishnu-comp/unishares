import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createNeed,
  getNeeds,
  getNeedById,
  addComment,
  updateNeedStatus,
  getAllNeeds,
  deleteNeed
} from '../controllers/needController.js';

const router = express.Router();

// Public routes
router.get('/', getNeeds);
router.get('/all', getAllNeeds);
router.get('/:id', getNeedById);

// Protected routes
router.post('/', protect, createNeed);
router.post('/:id/comments', protect, addComment);
router.put('/:id/status', protect, updateNeedStatus);
router.delete('/:id', protect, deleteNeed);

export default router; 