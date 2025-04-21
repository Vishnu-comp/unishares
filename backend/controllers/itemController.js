// File: backend/controllers/itemController.js
import Item from '../models/Item.js';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createItem = async (req, res) => {
  try {
    const extractedData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      category: req.body.category,
      price: req.body.price,
      condition: req.body.condition,
      location: JSON.parse(req.body.location),
      negotiable: req.body.negotiable === 'true'
    };

    // Add rental details if item type is rent
    if (req.body.type === 'rent' && req.body.rentalDetails) {
      extractedData.rentalDetails = JSON.parse(req.body.rentalDetails);
    }

    // Process images
    if (req.files && req.files.length > 0) {
      extractedData.images = req.files.map(file => 
        `/uploads/images/${file.filename}`
      );
    }

    // Add owner and status
    extractedData.owner = req.user._id;
    extractedData.status = 'pending';
    extractedData.wishlistedBy = [];
    extractedData.views = 0;

    const newItem = new Item(extractedData);
    await newItem.save();

    // Create notification for admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'item_pending',
      content: `New item "${extractedData.title}" needs approval`,
      relatedItem: newItem._id
    }));
    
    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: 'Item created and pending approval',
      item: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create item'
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'available' })
      .populate('owner', 'name email')
      .populate('wishlistedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      error: 'Failed to fetch items',
      details: error.message 
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('wishlistedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        error: 'Item not found',
        details: 'The requested item does not exist'
      });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      error: 'Failed to fetch item',
      details: error.message
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    // Create update data object from request body
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      condition: req.body.condition,
      type: req.body.type,
      category: req.body.category
    };

    // Only include rental details if type is rent and details are provided
    if (req.body.type === 'rent' && req.body.rentalDetails) {
      updateData.rentalDetails = req.body.rentalDetails;
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ 
      error: 'Failed to update item',
      details: error.message 
    });
  }
};

// export const deleteItem = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);
    
//     if (!item) {
//       return res.status(404).json({ message: 'Item not found' });
//     }
    
//     if (item.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this item' });
//     }

//     await Item.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     res.status(500).json({ error: 'Failed to delete item' });
//   }
// };

export const toggleWishlist = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const isWishlisted = item.wishlistedBy.includes(req.user._id);
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        [isWishlisted ? '$pull' : '$addToSet']: {
          wishlistedBy: req.user._id
        }
      },
      { new: true }
    ).populate('owner', 'name email')
     .populate('wishlistedBy', 'name email');

    res.json(updatedItem);
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(400).json({ error: 'Failed to toggle wishlist' });
  }
};

// Get user's own listings
export const getMyListings = async (req, res) => {
  try {
    // Get items owned by the current user
    const items = await Item.find({ 
      owner: req.user._id
    })
    .populate('owner', 'name email')
    .populate('wishlistedBy', 'name email')
    .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch listings',
      details: error.message 
    });
  }
};

export const markAsSold = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if the user is the owner of the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this item' });
    }

    // Update item status to sold
    item.status = 'sold';
    await item.save();

    // Create notification for users who wishlisted this item
    const notifications = item.wishlistedBy.map(userId => ({
      recipient: userId,
      type: 'item_update',
      content: `Item "${item.title}" has been marked as sold`,
      relatedItem: item._id
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json({ message: 'Item marked as sold successfully', item });
  } catch (error) {
    console.error('Error marking item as sold:', error);
    res.status(500).json({ error: 'Failed to mark item as sold' });
  }
};

export const getSellerItems = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const items = await Item.find({ 
      owner: sellerId,
      status: 'available', // Only get available items
      _id: { $ne: req.query.excludeId } // Exclude current item if specified
    })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .limit(3); // Limit to 3 items
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching seller items:', error);
    res.status(500).json({ 
      error: 'Failed to fetch seller items',
      details: error.message 
    });
  }
};

export const searchItems = async (req, res) => {
  const { query } = req.query;

  try {
    const items = await Item.find({
      title: { $regex: query, $options: 'i' } // Case-insensitive search
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name email'); // Adjust as necessary
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if the user is the owner or an admin
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};


export const getRecommendations = async (req, res) => {
  const { category } = req.query;
  console.log('Fetching recommendations for category:', category);

  try {
    if (!category) {
      return res.status(400).json({ 
        error: 'Category parameter is required'
      });
    }

    const recommendations = await Item.find({
      category,
      status: 'available',
      // Exclude the current item if an ID is provided
      ...(req.query.excludeId && { _id: { $ne: req.query.excludeId } })
    })
    .limit(5)
    .populate('owner', 'name email');

    console.log(`Found ${recommendations.length} recommendations`);
    res.json(recommendations);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recommendations',
      details: error.message 
    });
  }
};
