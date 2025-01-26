// Importing required modules and models
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");
const sentOtp = require("../services/sendOTP");

// Function to create a new user
const createUser = async (req, res) => {
  // 1. Log the incoming data from the request
  console.log(req.body);

  // 2. Extract the necessary data from the request body
  const { fullname, phone, usertype, username, password } = req.body;

  // 3. Validate the extracted data (ensure no field is empty)
  if (!phone || !fullname || !username || !password || !usertype) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!",
    });
  }

  // 3.1. Determine if the user is an admin based on the usertype
  let isAdmin = usertype === "Seller";

  try {
    // 4. Check if a user with the same username already exists
    const existingUser = await userModel.findOne({ username: username });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already in use!!!",
      });
      // return res.status(400).json({
      //   success: false,
      //   message: "Username already in use!!!",
      // });
    }

    // 4.1. Check if a user with the same phone number already exists
    const existingPhone = await userModel.findOne({ phone: phone });
    if (existingPhone) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Phone number already registered!!!",
      // });
      return res.json({
        success: false,
        message: "Phone number already registered!!!",
      });
    }

    // 5. Hash the password to secure it before storing
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // 6. Create a new user with the provided data
    const newUser = new userModel({
      fullname: fullname,
      phone: phone,
      username: username,
      password: hashedPassword,
      isAdmin: isAdmin,
    });

    // 7. Save the new user to the database
    await newUser.save();

    // 8. Send a success response back to the client
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Function to log in a user
const loginUser = async (req, res) => {
  // 1. Log the incoming data from the request
  console.log(req.body);

  // 2. Extract the necessary data from the request body
  const { username, password } = req.body;

  // 3. Validate the extracted data (ensure no field is empty)
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!",
    });
  }

  try {
    // 4. Check if a user with the provided username exists
    const user = await userModel.findOne({ username: username });
    if (!user) {
      // return res.status(400).json({
      //   success: false,
      //   message: "User does not exist!!!",
      // });
      return res.json({
        success: false,
        message: "User does not exist!!!",
      });
      

    }

    // 5. Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Incorrect Password!!!",
      });
      // return res.status(400).json({
      //   success: false,
      //   message: "Incorrect Password!!!",
      // });
    }

    // 6. Generate a JWT token for the user
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // 7. Send a success response with the token and user data
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to update user details
const updateUserDetails = async (req, res) => {
  console.log(req.body);

  // Extract the necessary data from the request body
  const { userId, fullname, username, password } = req.body;

  // Validate the data (ensure no field is empty)
  if (!userId || !fullname || !username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!",
    });
  }

  try {
    // Check if another user with the same username already exists
    const existingUserByUsername = await userModel.findOne({
      username: username,
    });
    if (
      existingUserByUsername &&
      existingUserByUsername._id.toString() !== userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Username already in use!",
      });
    }

    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long!",
      });
    }

    // Hash the new password before storing it
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // Update the user's details in the database
    const user = await userModel.findByIdAndUpdate(userId, {
      fullname: fullname,
      username: username,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!!!",
      });
    }

    // Save the updated user
    await user.save();

    // Send a success response back to the client
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to get user details by user ID
const getUserDetails = async (req, res) => {
  const { userId } = req.query;

  // Validate the request (ensure userId is provided)
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required!",
    });
  }

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Send the user data back to the client
    res.status(201).json({
      success: true,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to delete a user by ID
const userDelete = async (req, res) => {
  const { userId } = req.query;

  // Validate the request (ensure userId is provided)
  if (!userId) {
    return res.json({
      success: false,
      message: "User ID is required!",
    });
  }

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Delete the user from the database
    await userModel.findByIdAndDelete(userId);

    // Send a success response back to the client
    res.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// Function to handle placing an order
const orders = async (req, res) => {
  console.log(req.body); // Log the request body for debugging

  const { userId, productCost, paidStatus, orderId, productIds } = req.body;

  // Check if any required fields are missing
  if (!userId || !productCost || paidStatus === undefined || !orderId) {
    return res.json({
      success: false,
      message: "All fields are required!", // Return an error if any fields are missing
    });
  }

  try {
    // Find the user by their ID in the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!", // Return an error if the user doesn't exist
      });
    }

    // Create a new order object with the provided details
    const userOrder = {
      userId,
      productCost,
      paidStatus,
      orderId,
    };

    if (productIds != null) {
      for (const productId of productIds) {
        const product = await productModel.findById(productId);
        if (product) {
          product.adminOrders.push(userOrder);
          await product.save();
        } else {
          console.log(`Product with ID ${productId} not found.`); // Log if the product is not found
        }
      }
    }

    // Clear user cart after placing the order
    user.cart = [];
    // Add the order to the user's orders and save the user
    user.orders.push(userOrder);
    await user.save();

    // Send a success response with the order details
    res.json({
      success: true,
      message: "Order placed successfully!",
      orderD: userOrder,
    });
  } catch (e) {
    console.log(e); // Log any errors that occur
    return res.json({
      success: false,
      message: "Internal server error!", // Return an error if something goes wrong
    });
  }
};

// Function to handle forgot password requests
const forgotPassword = async (req, res) => {
  const { phone } = req.body;

  // Check if the phone number is provided
  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Please enter phone number!", // Return an error if the phone number is missing
    });
  }

  try {
    // Find the user by their phone number
    const user = await userModel.findOne({ phone: phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Phone not found!", // Return an error if the phone number is not found
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set the OTP expiry time to 6 minutes
    const expiryDate = Date.now() + 360000;

    // Save the OTP and its expiry time to the user's account
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiryDate;
    await user.save();

    // Send the OTP to the user's phone number
    const isSent = await sentOtp(phone, otp);

    // Check if the OTP was sent successfully
    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: "Error sending OTP!", // Return an error if the OTP couldn't be sent
      });
    }

    // Send a success response if the OTP was sent successfully
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (e) {
    console.log(e); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!", // Return an error if something goes wrong
    });
  }
};

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(`Decoded token: ${JSON.stringify(decoded)}`);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Function to verify OTP and set a new password
const verifyOtpAndSetPassword = async (req, res) => {
  console.log(req.body);
  // 1. Get data from the request body
  const { phone, otp, newPassword } = req.body;

  // 2. Validate the data (If empty, stop the process and send an error response)
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    // 3. Find the user by phone number
    const user = await userModel.findOne({ phone: phone });

    // 4. Check if the OTP has expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired!",
      });
    }

    // 5. Verify the OTP
    if (user.resetPasswordOTP != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // 6. Hash the new password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, randomSalt);

    // 7. Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // 8. Send a success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Exporting all the functions so they can be used in other parts of the application
module.exports = {
  createUser,
  loginUser,
  updateUserDetails,
  userDelete,
  getUserDetails,
  orders,
  forgotPassword,
  verifyOtpAndSetPassword,
  getMe,
};
