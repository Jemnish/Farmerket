// Importing necessary packages
const express = require("express"); // Web framework for Node.js
const dotenv = require("dotenv"); // For managing environment variables
const cors = require("cors"); // For enabling Cross-Origin Resource Sharing
const acceptFormData = require("express-fileupload"); // For handling file uploads
const databaseConnection = require("./database/database"); // Custom module for database connection
const path = require("path"); // For handling file and directory paths
const { globalRateLimiter } = require("./middleware/rateLimiter"); // Import rate limiter

// Creating an Express application instance
const app = express();

// Configuring CORS (Cross-Origin Resource Sharing) policy
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true, // Allow credentials (like cookies) to be sent
  optionSuccessStatus: 200, // Success status code for preflight requests
};

app.use(cors(corsOptions)); // Applying CORS middleware

// Serving static files for product images
app.use("/products", express.static(path.join(__dirname, "public/products")));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to handle file uploads
app.use(acceptFormData());

// Configuring environment variables from .env file
dotenv.config();

// Connecting to the database
databaseConnection();

// Apply global rate limiter before defining API routes
app.use(globalRateLimiter);

// Setting up API routes for different functionalities
app.use("/api/user", require("./routes/userRoutes")); // User-related routes
app.use("/api/product", require("./routes/productRoutes")); // Product-related routes
app.use("/api/cart", require("./routes/cartRoutes")); // Cart-related routes

// Defining the port for the server (usually between 5000 and 6000)
// Using the port value specified in the .env file
const PORT = process.env.PORT || 5000;

// Starting the server and listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!!!`); // Log message when server starts
});

module.exports = app;
