// File: backend/controllers/userController.js
import User from "../models/User.js";

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
  