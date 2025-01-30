const express = require("express");
const { generateOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

// Route to generate OTP
router.post("/generate_otp", generateOTP);

// Route to verify OTP
router.post("/verify_otp", verifyOTP);

module.exports = router;
