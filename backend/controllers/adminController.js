import User from '../models/User.js';
import Item from '../models/Item.js';
import Transaction from '../models/Transaction.js';
import Notification from '../models/Notification.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        user.role = role;
        await user.save();
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error updating user role" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await user.remove();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
};

export const getStats = async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalItems: await Item.countDocuments(),
            totalTransactions: await Transaction.countDocuments(),
            activeListings: await Item.countDocuments({ status: 'available' })
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Error fetching stats" });
    }
};

export const getPendingItems = async (req, res) => {
    try {
        const items = await Item.find({ status: 'pending' })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Error fetching pending items" });
    }
};

export const moderateItem = async (req, res) => {
    try {
        const { status, reason } = req.body;
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        
        item.status = status === 'approved' ? 'available' : 'rejected';
        item.moderationReason = reason;
        item.moderatedBy = req.user.id;
        item.moderatedAt = new Date();
        
        await item.save();

        await new Notification({
            recipient: item.owner,
            type: 'item_moderated',
            content: `Your item "${item.title}" has been ${item.status}${reason ? `: ${reason}` : ''}`,
            relatedItem: item._id
        }).save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Error moderating item" });
    }
}; 