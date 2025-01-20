// File: backend/models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['sale', 'rent', 'donation'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['textbooks', 'electronics', 'furniture', 'clothing', 'accessories', 'other'],
    required: true 
  },
  price: { 
    type: Number,
    required: function() {
      return this.type !== 'donation';
    },
    min: 0
  },
  negotiable: { 
    type: Boolean, 
    default: false 
  },
  images: [{
    type: String
  }],
  condition: { 
    type: String, 
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'sold', 'rented', 'donated'], 
    default: 'available' 
  },
  location: {
    building: { type: String, required: true },
    campus: { type: String, required: true }
  },
  rentalDetails: {
    durationType: { 
      type: String, 
      enum: ['hour', 'day', 'week'],
      required: function() {
        return this.type === 'rent';
      }
    },
    pricePerUnit: {
      type: Number,
      required: function() {
        return this.type === 'rent';
      }
    },
    minimumDuration: {
      type: Number,
      required: function() {
        return this.type === 'rent';
      }
    },
    deposit: Number,
    terms: String
  },
  wishlistedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderationReason: String,
  views: {
    type: Number,
    default: 0
  },
  lastViewed: Date
}, { timestamps: true });

// Add index for better search performance
itemSchema.index({ title: 'text', description: 'text' });

// Export the model directly (not as a named export)
export default mongoose.model("Item", itemSchema);
