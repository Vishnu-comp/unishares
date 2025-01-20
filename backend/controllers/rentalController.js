import Item from '../models/Item.js';
import Transaction from '../models/Transaction.js';
import Notification from '../models/Notification.js';

export const createRental = async (req, res) => {
    try {
        const { itemId, duration } = req.body;
        const item = await Item.findById(itemId);
        
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        
        if (item.status !== 'available') {
            return res.status(400).json({ error: "Item is not available for rent" });
        }
        
        const rental = new Transaction({
            item: itemId,
            seller: item.listedBy,
            buyer: req.user.id,
            type: 'rental',
            status: 'pending',
            rentalDuration: duration,
            price: item.rentalDetails.deposit,
            rentalEndDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
        });
        
        await rental.save();
        
        item.status = 'rented';
        await item.save();
        
        // Create notification for item owner
        await new Notification({
            recipient: item.listedBy,
            type: 'rental_request',
            content: `New rental request for your item: ${item.title}`,
            relatedItem: itemId
        }).save();
        
        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error creating rental" });
    }
};

export const getRentals = async (req, res) => {
    try {
        const rentals = await Transaction.find({
            $or: [{ buyer: req.user.id }, { seller: req.user.id }],
            type: 'rental'
        })
        .populate('item')
        .populate('buyer', 'name email')
        .populate('seller', 'name email');
        
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: "Error fetching rentals" });
    }
};

export const getRentalById = async (req, res) => {
    try {
        const rental = await Transaction.findById(req.params.id)
            .populate('item')
            .populate('buyer', 'name email')
            .populate('seller', 'name email');
            
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }
        
        if (rental.buyer.toString() !== req.user.id && rental.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error fetching rental" });
    }
};

export const updateRentalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const rental = await Transaction.findById(req.params.id);
        
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }
        
        if (rental.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        rental.status = status;
        await rental.save();
        
        // Create notification for renter
        await new Notification({
            recipient: rental.buyer,
            type: 'rental_update',
            content: `Your rental request has been ${status}`,
            relatedItem: rental.item
        }).save();
        
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error updating rental status" });
    }
};

export const extendRental = async (req, res) => {
    try {
        const { additionalDays } = req.body;
        const rental = await Transaction.findById(req.params.id);
        
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }
        
        if (rental.buyer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        rental.rentalEndDate = new Date(rental.rentalEndDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
        await rental.save();
        
        // Create notification for owner
        await new Notification({
            recipient: rental.seller,
            type: 'rental_extension',
            content: `Rental extension requested for ${additionalDays} days`,
            relatedItem: rental.item
        }).save();
        
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error extending rental" });
    }
};

export const completeRental = async (req, res) => {
    try {
        const rental = await Transaction.findById(req.params.id);
        
        if (!rental) {
            return res.status(404).json({ error: "Rental not found" });
        }
        
        if (rental.seller.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        rental.status = 'completed';
        await rental.save();
        
        const item = await Item.findById(rental.item);
        item.status = 'available';
        await item.save();
        
        // Create notifications for both parties
        await Promise.all([
            new Notification({
                recipient: rental.buyer,
                type: 'rental_complete',
                content: 'Rental has been marked as complete',
                relatedItem: rental.item
            }).save(),
            new Notification({
                recipient: rental.seller,
                type: 'rental_complete',
                content: 'Rental has been marked as complete',
                relatedItem: rental.item
            }).save()
        ]);
        
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error completing rental" });
    }
}; 