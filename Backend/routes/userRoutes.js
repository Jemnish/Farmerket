const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { loginRateLimiter } = require("../middleware/rateLimiter");

// Creating user registration route
router.post("/create", userController.createUser);

// Creating user login route
router.post("/login", loginRateLimiter, userController.loginUser);

// craeting user update route
router.put("/update", userController.updateUserDetails);

// creating user delete route
router.delete("/delete", userController.userDelete);

// creating user details route
router.get("/details", userController.getUserDetails);

// creating user orders route
router.post("/orders", userController.orders);

// forgot password
router.post("/forgot_password", userController.forgotPassword);

// verify otp and set password
router.post("/verify_otp", userController.verifyOtpAndSetPassword);

// getting user details
router.get("/getMe", userController.getMe);

module.exports = router;
