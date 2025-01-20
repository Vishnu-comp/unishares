import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    toggleWishlist,
    getMyListings
} from '../controllers/itemController.js';

const router = express.Router();

// Route order matters! Put specific routes before parameter routes
router.get('/mylistings', protect, getMyListings);
router.post('/', protect, upload.array('images', 5), createItem);
router.get('/', getItems);
router.get('/:id', getItemById);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/:id/wishlist', protect, toggleWishlist);

export default router; 