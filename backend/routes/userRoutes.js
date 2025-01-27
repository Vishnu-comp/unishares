// File: backend/routes/userRoutes.js
import express from 'express';
import { getUserProfile, getUserSettings, updateUserSettings, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../middleware/uploadMiddleware.js';
import multer from 'multer';

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/settings", protect, getUserSettings);
router.put("/settings", protect, updateUserSettings);
router.put("/profile", protect, uploadProfile, updateProfile);

export default router;
