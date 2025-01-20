import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getStats,
    moderateItem
} from '../controllers/adminController.js';

const router = express.Router();

// All routes need both authentication and admin role
router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.put('/items/:id/moderate', moderateItem);

export default router; 