const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    min: 10,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  orders: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  emailOTP:{
    type: Number,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  passwordHistory: {
    type: [String],
    default: [],
  },
  resetPasswordOTP: {
    type: Number,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  failedLoginAttempts: { type: Number, default: 0 },
  blockedUntil: { type: Date, default: null },
});

// Create a collection in mongodb with the name users
const User = mongoose.model("users", userSchema);
module.exports = User;
