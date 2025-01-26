const mongoose = require("mongoose");

// Define the review schema
const reviewSchema = new mongoose.Schema({
  reviewId: String,
  comment: String,
  rating: {
    type: Number,
    min: 0,
    default: 0,
  },
  userId: String,
  username: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the product schema
const productSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
    maxLength: 500,
  },
  productImage: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  adminOrders: {
    type: Array,
    default: [],
  },
  userId: {
    type: String,
    required: true,
  },
  productReviews: {
    type: Array,
    default: [],
  },

  averageRating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a collection in mongodb with the name products
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
