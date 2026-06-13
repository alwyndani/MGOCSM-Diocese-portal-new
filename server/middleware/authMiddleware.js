import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mgocsm_thumpamon_diocese_super_secret_key_2026_@!";

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check cookies first
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    // Fallback to Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Access denied. No authentication token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find admin in DB
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, role: true }
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid token. Administrative account not found." });
    }

    // Attach user payload to request
    req.user = admin;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ error: "Authentication failed. Session expired or invalid." });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Access forbidden. Super Admin rights required." });
  }
  next();
};
