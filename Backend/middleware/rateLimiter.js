const rateLimit = require("express-rate-limit");

// Create a rate limiter middleware
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (time window)
  max: 5, // Maximum 5 requests per windowMs
  message: "Too many login attempts. Please try again after 15 minutes.",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 15 minutes.",
    });
  },
});

module.exports = {
  loginRateLimiter,
};
