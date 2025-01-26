// Import the Express router to create routes
const router = require("express").Router();

// Import the cartController which contains the logic for cart operations
const cartController = require("../controllers/cartController");

// Route for adding an item to the cart
router.post("/add_to_cart", cartController.addToCart);

// Route for removing a single item from the cart
router.post("/remove_from_cart", cartController.removeFromCart);

// Route for removing all items from the cart
router.post("/remove_all_from_cart", cartController.removeAllFromCart);

// Route for initiating payment
router.post('/initiate-payment', cartController.initiatePayment);

// Export the router so it can be used in other parts of the application
module.exports = router;
