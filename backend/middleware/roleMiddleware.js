import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Access denied. Admin role required.' 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 