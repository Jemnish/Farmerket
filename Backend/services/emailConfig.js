const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

console.log("Email User:", process.env.EMAIL_USER); // Debugging
console.log("Email Pass:", process.env.EMAIL_PASS); // Debugging

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// The sendOTP function to send OTP to a user's email
const sendEmailOTP = async (email, otp, res) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found." });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP for Login",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to", email);
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

module.exports = sendEmailOTP;
