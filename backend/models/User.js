// models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  settings: {
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    },
    notifications: { 
      type: Boolean, 
      default: true 
    },
    language: { 
      type: String, 
      default: 'en' 
    }
  },
  profileImage: String,
  verified: {
    type: Boolean,
    default: false
  },
  listedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  },
  otp: { type: String, required: false },
  otpExpiration: { type: Date, required: false },
}, { 
  timestamps: true 
});

// Add index for email search
userSchema.index({ email: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
