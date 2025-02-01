const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const sendEmailOTP = require("../services/emailConfig");
const userModel = require("../models/userModel");
require("dotenv").config();

// Generate OTP and store in user model
const generateOTP = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(`🔹 Received OTP request for: ${username}`);

    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const email = user.email;
    console.log(`🔹 User email: ${email}`);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Update user model with OTP
    user.emailOTP = otp;
    await user.save();

    // Send OTP via email
    await sendEmailOTP(email, otp, res);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("❌ Error in generateOTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { username, otp } = req.body;
    console.log(`🔹 Verifying OTP for: ${username}`);
    console.log(`🔹 Entered OTP: ${otp}`);

    const user = await userModel.findOne({ username });
    if (!user) {
      console.log("❌ User not found!");
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    console.log(`🔹 Stored OTP in DB: ${user.emailOTP}`);

    // Check if OTP matches
    if (user.emailOTP && user.emailOTP.toString() === otp.toString()) {
      console.log("✅ OTP verified successfully!");

      // Clear OTP after successful verification
      user.emailOTP = null;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: true,
        maxAge: 3600000, // Token expires in 1 hour
      });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
        token: token,
        userData: user,
      });
    } else {
      console.log("❌ Invalid OTP!");
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("❌ Error in verifyOTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

module.exports = { generateOTP, verifyOTP };
