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
    getMyListings,
    markAsSold,
    getSellerItems
} from '../controllers/itemController.js';
import Item from '../models/Item.js';

const router = express.Router();

// Route order matters! Put specific routes before parameter routes
router.get('/mylistings', protect, getMyListings);
router.post('/', protect, upload.array('images', 5), createItem);
router.get('/', getItems);
router.get('/:id', getItemById);
router.put('/:id', protect, upload.array('images'), updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/:id/wishlist', protect, toggleWishlist);
router.put('/:id/mark-sold', protect, markAsSold);
router.get('/seller/:sellerId', getSellerItems);

export default router; 