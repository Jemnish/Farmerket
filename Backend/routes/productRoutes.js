// Import the Express router to create routes
const router = require("express").Router();

// Import the product controller that handles product-related actions
const productController = require("../controllers/productControllers");

// Import the authentication middleware to protect routes (not used in this example)
const { authGuard } = require("../middleware/authGuard");

// Route to create a new product
router.post("/create", productController.createProduct);

// Route to get all products
router.get("/get_all_products", productController.getAllProducts);

// Route to get a single product by its ID
router.get("/get_single_product/:id", productController.getSingleProduct);

// Route to get products with pagination
router.get("/pagination", productController.paginationProducts);

// Route to update a product by its ID
router.put("/update_product/:id", productController.updateProduct);

// mobile pagination
router.get('/mobile_pagination', productController.mobilePaginationProducts)

// Route to add a review to a product by its ID
router.post("/add_review/", productController.addReview);

// Route to delete a product by its ID
router.delete("/delete_product/:id", productController.deleteProduct);

// Route to get the total number of pages for pagination
router.get("/pageCount", productController.pageCount);

// Export the router to be used in other parts of the application
module.exports = router;
