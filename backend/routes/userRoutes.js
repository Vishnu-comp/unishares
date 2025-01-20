// File: backend/routes/userRoutes.js
import express from 'express';
import { getUserProfile, getUserSettings, updateUserSettings } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/settings", protect, getUserSettings);
router.put("/settings", protect, updateUserSettings);

export default router;
