import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createRental,
    getRentals,
    getRentalById,
    updateRentalStatus,
    extendRental,
    completeRental
} from '../controllers/rentalController.js';

const router = express.Router();

router.use(protect);

router.post('/', createRental);
router.get('/', getRentals);
router.get('/:id', getRentalById);
router.put('/:id/status', updateRentalStatus);
router.put('/:id/extend', extendRental);
router.put('/:id/complete', completeRental);

export default router; 