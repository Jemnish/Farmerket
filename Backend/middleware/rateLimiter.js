const rateLimit = require("express-rate-limit");

// Global rate limiter for all routes
const globalRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10000, // Max 10000 requests per 5 minutes per IP
  message: "Too many requests. Please try again later.",
  standardHeaders: true, // Includes rate limit info in headers
  legacyHeaders: false, // Disable old headers
});

module.exports = { globalRateLimiter };
