import mongoose from "mongoose";

const needSchema = new mongoose.Schema({
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
    enum: ['item', 'service', 'rental'],
    required: true 
  },
  category: { 
    type: String, 
    enum: ['textbooks', 'electronics', 'furniture', 'clothing', 'tutoring', 'other'],
    required: true 
  },
  budget: { 
    type: Number,
    min: 0
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'fulfilled', 'expired', 'cancelled'], 
    default: 'active' 
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

needSchema.index({ title: 'text', description: 'text' });

export default mongoose.model("Need", needSchema); 