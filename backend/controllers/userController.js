// File: backend/controllers/userController.js
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

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

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Create a new user instance
    const newUser = new User({ firstName, lastName, email, password });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    newUser.otp = otp;
    newUser.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    // Save the new user to the database
    await newUser.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: 'User registered successfully. Please verify your email with the OTP sent.' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Error in registration' });
  }
};

// Verify OTP
export const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp || Date.now() > user.otpExpiration) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid, update user verification status
    user.is_verified = 1; // Assuming you have this field
    user.otp = undefined; // Clear OTP
    user.otpExpiration = undefined; // Clear expiration
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};
  








