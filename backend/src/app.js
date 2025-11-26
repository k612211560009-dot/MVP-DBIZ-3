const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes");
const { sequelize } = require("./models");

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * Logging Middleware
 */
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

/**
 * API Routes
 */
app.use("/api", routes);

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.json({
    message: "Milk Bank Management System API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 Handler
 */
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));

    return res.status(400).json({
      error: "Validation Error",
      message: "Database validation failed",
      details: errors,
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      error: "Duplicate Entry",
      message: "A record with this information already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Authentication Failed",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Authentication Failed",
      message: "Token expired",
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.name || "Error",
    message:
      process.env.NODE_ENV === "production" && statusCode === 500
        ? "Something went wrong"
        : message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

/**
 * Database Connection Test
 */
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database in development
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_SYNC === "true"
    ) {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synchronized.");
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

/**
 * Server Startup
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  });
};

// Start server only when run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
