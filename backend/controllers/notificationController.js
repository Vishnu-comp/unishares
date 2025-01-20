import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('relatedItem', 'title images')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        notification.read = true;
        await notification.save();
        
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: "Error marking notification as read" });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        await notification.remove();
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting notification" });
    }
}; 