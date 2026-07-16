import rateLimit from "express-rate-limit";

// Helper to determine if we are in development mode
const isDev = process.env.NODE_ENV === "development";

/**
 * Custom handler to return a structured JSON response when rate limited
 */
const rateLimitHandler = (req, res, next, options) => {
  console.warn(`[RateLimit] Limit exceeded for IP: ${req.ip} on route: ${req.originalUrl}`);
  res.status(options.statusCode).json({
    success: false,
    statusCode: options.statusCode,
    message: options.message.message || "Too many requests. Please try again later.",
    retryAfter: res.getHeader("Retry-After") ? `${res.getHeader("Retry-After")} seconds` : undefined,
  });
};

/**
 * Custom key generator to safely resolve the client's actual IP address
 * when behind reverse proxies (like Cloudflare, Nginx, AWS, Render, Heroku)
 */
const keyGenerator = (req) => {
  return (
    req.headers["cf-connecting-ip"] || // Cloudflare
    req.headers["x-real-ip"] ||        // Nginx
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || // Standard proxy
    req.ip ||                          // Fallback to Express resolved IP
    req.socket.remoteAddress
  );
};

/**
 * Global API Rate Limiter
 * Applied globally to shield the server from general scraping, DDoS, or resource exhaustion.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 500, // Higher limits in development to prevent local blockages
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
  statusCode: 429,
  standardHeaders: "draft-7", // Return standard rate limit headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
  legacyHeaders: false, // Disable older X-RateLimit-* headers
  keyGenerator: keyGenerator,
  handler: rateLimitHandler,
  validate: { keyGeneratorIpFallback: false },
  skip: (req) => {
    // Optional: Add conditions to skip rate limiting (e.g. internal health check routes)
    return req.path === "/health" || req.path === "/";
  }
});

/**
 * Strict Authentication & Security Rate Limiter
 * Recommended for route-level middleware on sensitive endpoints (e.g., Auth, Reset Password, Payments).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 15, // Strict limit: 5 requests per 15 minutes in production
  message: {
    success: false,
    message: "Too many login or registration attempts. Please try again in 15 minutes.",
  },
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: keyGenerator,
  handler: rateLimitHandler,
  validate: { keyGeneratorIpFallback: false },
});