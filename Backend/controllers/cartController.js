// Import required modules
const path = require("path");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const axios = require("axios");

// Function to add a product to the user's cart
const addToCart = async (req, res) => {
  // Extract userId and productId from the request body
  const { userId, productId } = req.body;
  console.log(req.body);

  // Check if both userId and productId are provided
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Find the product by productId
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist!",
      });
    }

    // Check if the product is already in the user's cart
    const existingCartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If the product is already in the cart, increase the quantity
    if (existingCartItemIndex !== -1) {
      user.cart[existingCartItemIndex].quantity += 1;
    } else {
      // If the product is not in the cart, add it with quantity 1
      const cartItem = {
        productId: product._id,
        quantity: 1,
        ...product.toObject(),
      };
      user.cart.push(cartItem);
    }

    // Save the updated cart to the database
    await user.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to remove a product from the user's cart
const removeFromCart = async (req, res) => {
  // Extract userId and productId from the request body
  const { userId, productId } = req.body;
  console.log(req.body);

  // Check if both userId and productId are provided
  if (!userId || !productId) {
    return res.json({
      success: false,
      message: "All fields are required!",
    });
  }

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Find the product by productId
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product does not exist!",
      });
    }

    // Find the product in the cart and remove it
    const cart = user.cart;
    const index = cart.indexOf(productId);
    cart.splice(index, 1);
    user.cart = cart;

    // Save the updated cart to the database
    await user.save();

    // Respond with success message
    res.json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to remove all products from the user's cart
const removeAllFromCart = async (req, res) => {
  // Extract userId from the request body
  const { userId } = req.body;
  console.log(req.body);

  // Check if userId is provided
  if (!userId) {
    return res.json({
      success: false,
      message: "All fields are required!",
    });
  }

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Clear the cart by setting it to an empty array
    user.cart = [];
    await user.save();

    // Respond with success message
    res.json({
      success: true,
      message: "All products removed from cart successfully",
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error!",
    });
  }
};
const initiatePayment = async (req, res) => {
  console.log(req.body);
  try {
    const {
      amount,
      purchase_order_id,
      purchase_order_name,
      return_url,
      website_url,
    } = req.body;

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url,
        website_url,
        amount,
        purchase_order_id,
        purchase_order_name,
        customer_info: {
          name: "Ramu",
          email: "ramu@example.com",
          phone: "9800000000",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the payment URL to the frontend
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the functions so they can be used in other files
module.exports = {
  addToCart,
  removeFromCart,
  removeAllFromCart,
  initiatePayment,
};
