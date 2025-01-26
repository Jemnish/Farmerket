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
  orders: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  resetPasswordOTP: {
    type: Number,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// Create a collection in mongodb with the name users
const User = mongoose.model("users", userSchema);
module.exports = User;
