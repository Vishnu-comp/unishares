// File: backend/controllers/userController.js
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error fetching user profile" });
    }
  };

export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    res.json(user.settings || {});
  } catch (error) {
    res.status(500).json({ error: "Error fetching user settings" });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { settings: req.body },
      { new: true }
    ).select("settings");
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ error: "Error updating user settings" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update profile image if provided
    if (req.file) {
      // Delete old profile image if exists
      if (user.profileImage) {
        try {
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'profiles', path.basename(user.profileImage));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old profile image:', error);
        }
      }
      
      // Update with new image path
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: "Error updating profile" });
  }
};
  








