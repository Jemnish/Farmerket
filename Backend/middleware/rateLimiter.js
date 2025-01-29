const rateLimit = require("express-rate-limit");

// Global rate limiter for all routes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes per IP
  message: "Too many requests. Please try again later.",
  standardHeaders: true, // Includes rate limit info in headers
  legacyHeaders: false, // Disable old headers
});

module.exports = { globalRateLimiter };

