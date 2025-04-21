import Need from '../models/Need.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const createNeed = async (req, res) => {
  try {
    const { title, description, type, category, budget, urgency, duration } = req.body;

    // Calculate expiry date based on duration (in days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(duration));

    const need = new Need({
      title,
      description,
      type,
      category,
      budget: budget || 0,
      urgency,
      expiryDate,
      owner: req.user._id
    });

    await need.save();

    res.status(201).json(need);
  } catch (error) {
    console.error('Create need error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getNeeds = async (req, res) => {
  try {
    const { type, category, status } = req.query;
    const query = { status: 'active', expiryDate: { $gt: new Date() } };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    const needs = await Need.find(query)
      .populate('owner', 'name email profileImage')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(needs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching needs' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const need = await Need.findById(id);
    
    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    const comment = {
      user: userId,
      content: content,
      createdAt: new Date()
    };

    need.comments.push(comment);
    await need.save();

    // Fetch the updated need with populated user data
    const updatedNeed = await Need.findById(id)
      .populate('owner', 'name email profileImage')
      .populate('comments.user', 'name email profileImage');

    res.status(200).json(updatedNeed);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      error: 'Failed to add comment',
      details: error.message 
    });
  }
};

export const updateNeedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const need = await Need.findById(req.params.id);

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    if (need.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    need.status = status;
    await need.save();

    res.json(need);
  } catch (error) {
    res.status(500).json({ error: 'Error updating need status' });
  }
};

export const getNeedById = async (req, res) => {
  try {
    const need = await Need.findById(req.params.id)
      .populate('owner', 'name email profileImage')
      .populate('comments.user', 'name email profileImage');

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    res.json(need);
  } catch (error) {
    console.error('Get need by id error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch need',
      details: error.message 
    });
  }
};

export const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find()
      .populate('owner', 'name email profileImage')
      .populate('comments.user', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json(needs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all needs' });
  }
};

export const deleteNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const need = await Need.findById(id);

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    if (need.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await need.remove(); // Delete the need
    res.status(200).json({ message: 'Need deleted successfully' });
  } catch (error) {
    console.error('Delete need error:', error);
    res.status(500).json({ error: 'Error deleting need' });
  }
}; 