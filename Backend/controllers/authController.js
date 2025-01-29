const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const sendOTP = require("../config/emailConfig");
require("dotenv").config();

let otpStore = {}; // Temporary storage for OTPs

// Generate and send OTP via email
exports.generateOTP = async (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = speakeasy.totp({
    secret: process.env.JWT_SECRET,
    encoding: "base32",
  });

  // Store OTP (valid for 10 minutes)
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  // Send OTP via email
  await sendOTP(email, otp);

  res.json({ success: true, message: "OTP sent to your email." });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "No OTP found. Request a new one." });
  }

  // Check OTP expiration
  if (Date.now() > otpStore[email].expiresAt) {
    delete otpStore[email]; // Clear expired OTP
    return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
  }

  // Verify OTP
  if (otpStore[email].otp === otp) {
    delete otpStore[email]; // Clear OTP after successful login

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "OTP verified!", token });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP." });
  }
};
