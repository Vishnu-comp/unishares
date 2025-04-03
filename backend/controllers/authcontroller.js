import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

const emailPattern = /^[a-zA-Z0-9._%+-]+@.+\.christuniversity\.in$/; // Regex for validating email format

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        // Validate email format
        if (!emailPattern.test(email)) {
            return res.status(400).json({ error: "Email must be in the format: @course.christuniversity.in" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user (password will be hashed by the pre-save middleware)
        const user = await User.create({
            name,
            email,
            password,
            role,
            verified: false, // Ensure user is not verified at registration
        });

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        user.otp = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

        // Save the user with OTP
        await user.save();

        // Send OTP email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'noreply.intervo@gmail.com',
                pass: 'aczyhjubehuvdrag',
            },
        });

        const mailOptions = {
            from: 'noreply.intervo@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "User registered successfully. Please verify your email with the OTP sent.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Registration failed" });
    }
};

// Verify OTP
export const verifyOtpController = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp || Date.now() > user.otpExpiration) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Mark user as verified
        user.verified = true;
        user.otp = undefined; // Clear OTP after verification
        user.otpExpiration = undefined; // Clear OTP expiration
        await user.save();

        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        // Find user
        const user = await User.findOne({ email });
        
        // Debug log
        console.log('Login attempt:', { email, userFound: !!user });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // Debug log
        console.log('Password check:', { isMatch });

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Login failed" });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: "Error fetching user data" });
    }
};