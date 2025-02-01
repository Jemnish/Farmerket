// Importing required modules and models
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");
const sentOtp = require("../services/sendOTP");
const sanitizeHtml = require("sanitize-html");

const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {}, // Remove all attributes
  });
};

// Function to create a new user
const createUser = async (req, res) => {
  // 1. Log the incoming data from the request
  console.log(req.body);

  // 2. Extract the necessary data from the request body
  const { fullname, phone, usertype, username, password, email } = req.body;

  // 3. Validate the extracted data (ensure no field is empty)
  if (!phone || !fullname || !username || !password || !usertype || !email) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!",
    });
  }

  const cleanPhone = sanitizeInput(phone);
  const cleanFullname = sanitizeInput(fullname);
  const cleanUsername = sanitizeInput(username);
  const cleanEmail = sanitizeInput(email);

  // password validation (at least 6 characters) and special character, number, uppercase and lowercase
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters with at least one uppercase, one lowercase, one number and one special character",
    });
  }

  // 3.1. Determine if the user is an admin based on the usertype
  let isAdmin = usertype === "Seller";

  try {
    // 4. Check if a user with the same username already exists
    const existingUser = await userModel.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already in use!!!",
      });
    }

    // check if a user with the same email already exits
    const existingEmail = await userModel.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.json({
        success: false,
        message: "Email already registered!!!",
      });
    }

    // 4.1. Check if a user with the same phone number already exists
    const existingPhone = await userModel.findOne({ phone: cleanPhone });
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
      fullname: cleanFullname,
      phone: cleanPhone,
      username: cleanUsername,
      password: hashedPassword,
      email: cleanEmail,
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

const MAX_FAILED_ATTEMPTS = 5; // Maximum allowed failed attempts
const BLOCK_DURATION_MINUTES = 15; // Block duration in minutes

// Function to log in a user
const loginUser = async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!",
    });
  }

  try {
    // Find the user by username
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist!!!",
      });
    }

    // Check if the user is blocked
    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      const remainingTime = Math.ceil((user.blockedUntil - Date.now()) / 60000); // Convert to minutes
      return res.json({
        success: false,
        message: `Account temporarily blocked. Try again in ${remainingTime} minutes.`,
      });
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Increment failed attempts
      user.failedLoginAttempts += 1;

      // Block the user if they exceed the maximum allowed attempts
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.blockedUntil = new Date(
          Date.now() + BLOCK_DURATION_MINUTES * 60000
        ); // Set block expiry time
        await user.save();
        return res.json({
          success: false,
          message: `Too many failed attempts. Account blocked for ${BLOCK_DURATION_MINUTES} minutes.`,
        });
      }

      // Save the updated failed attempts count
      await user.save();

      return res.json({
        success: false,
        message: `Incorrect Password! You have ${
          MAX_FAILED_ATTEMPTS - user.failedLoginAttempts
        } attempts remaining.`,
      });
    }

    // Reset failed attempts and blockedUntil on successful login
    user.failedLoginAttempts = 0;
    user.blockedUntil = null;
    await user.save();

    // Generate JWT token
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Send success response
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

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!!!",
      });
    }

    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long!",
      });
    }

    // **Password Reuse Check**
    const isPasswordReused = user.passwordHistory.some((hashedPassword) => {
      return bcrypt.compareSync(password, hashedPassword);
    });

    if (isPasswordReused) {
      return res.status(400).json({
        success: false,
        message: "You cannot reuse a recent password!",
      });
    }

    // **Password Expiry Check**
    const expiryPeriod = 90; // Password expiry in days
    const passwordAgeInDays =
      (Date.now() - new Date(user.passwordUpdatedAt)) / (1000 * 60 * 60 * 24);

    if (passwordAgeInDays > expiryPeriod) {
      return res.status().json({
        success: false,
        message: "Your password has expired. Please change it.",
      });
    }

    // Hash the new password before storing it
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // **Update Password History** (limit to 5 passwords)
    if (user.passwordHistory.length >= 5) {
      user.passwordHistory.shift(); // Remove the oldest password
    }

    user.passwordHistory.push(hashedPassword); // Add new password to history

    // Update the user's details in the database, including password history and last updated timestamp
    user.fullname = fullname;
    user.username = username;
    user.password = hashedPassword;
    user.passwordUpdatedAt = Date.now();

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
  const csrfTOken = req.data.csrfTOken;

  // Validate the request (ensure userId is provided)
  if (!userId) {
    return res.json({
      success: false,
      message: "User ID is required!",
    });
  }

  // session validation
  if (!csrfTOken) {
    return res.json({
      success: false,
      message: "Session ID is required!",
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
