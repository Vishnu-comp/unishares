// routes/authRoutes.js

import express from "express";
import { loginUser, registerUser, verifyOtpController } from "../controllers/authcontroller.js"; // Named imports
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser); // Registration route
router.get("/me", protect, getUserProfile); // Profile route for logged in user
router.post("/verify-otp", verifyOtpController); // Verify OTP route
//router.post("/test-bcrypt", testBcrypt);

export default router;
