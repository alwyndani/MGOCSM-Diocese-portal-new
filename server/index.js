import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";

// Route imports
import authRouter from "./routes/auth.js";
import contentRouter from "./routes/content.js";
import dashboardRouter from "./routes/dashboard.js";

// Setup dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiter for security
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per 15 minutes
  message: { error: "Too many requests from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 authentication attempts
  message: { error: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static file assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Apply rate limits
app.use("/api/auth/login", loginLimiter);
app.use("/api/", apiLimiter);

// Bind API route maps
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/dashboard", dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({ error: err.message || "An unexpected error occurred on the server." });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Server] MGOCSM Backend active on port ${PORT}`);
  console.log(`[Server] Static files served at http://localhost:${PORT}/uploads/`);
});
