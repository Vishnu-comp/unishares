import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getChats, createChat, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.post('/:chatId/messages', protect, sendMessage);

export default router; 