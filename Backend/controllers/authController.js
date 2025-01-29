const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const sendEmailOTP = require("../services/emailConfig");
const userModel = require("../models/userModel");
require("dotenv").config();

let otpStore = {};


const generateOTP = async (req, res) => {
  
  try {
    const { username } = req.body;
    console.log(username);

    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
    const email = user.email;

    const otp = speakeasy.totp({
      secret: process.env.JWT_SECRET,
      encoding: "base32",
    });

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    // Pass `res` to sendOTP
    await sendEmailOTP(email, otp, res);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error in generateOTP:", error);
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

    // Find email by searching username
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
    const email = user.email;

    if (!otpStore[email]) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found. Request a new one." });
    }

    // Check OTP expiration
    if (Date.now() > otpStore[email].expiresAt) {
      delete otpStore[email]; // Clear expired OTP
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new one." });
    }

    // Verify OTP
    if (otpStore[email].otp === otp) {
      delete otpStore[email]; // Clear OTP after successful login

      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ success: true, message: "OTP verified!", token });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

module.exports = { generateOTP, verifyOTP };
