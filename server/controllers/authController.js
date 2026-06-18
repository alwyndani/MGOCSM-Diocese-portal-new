import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logActivity } from "../utils/logger.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mgocsm_thumpamon_diocese_super_secret_key_2026_@!";
const NODE_ENV = process.env.NODE_ENV || "development";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required fields." });
    }

    // Find administrator
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid administrative credentials." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid administrative credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Log the event
    await logActivity(admin.id, "LOGIN", "Admins", `Admin logged in from IP`, req);

    return res.json({
      message: "Successfully logged in.",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token // also return in JSON for frontends storing it locally
    });
  } catch (err) {
    console.error("Login Controller Error:", err.message);
    return res.status(500).json({ error: "Internal server error during authentication." });
  }
};

export const logout = async (req, res) => {
  try {
    const adminId = req.user ? req.user.id : null;
    if (adminId) {
      await logActivity(adminId, "LOGOUT", "Admins", "Admin logged out successfully", req);
    }
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({ message: "Successfully logged out." });
  } catch (err) {
    console.error("Logout Controller Error:", err.message);
    return res.status(500).json({ error: "Internal server error during logout." });
  }
};

export const me = async (req, res) => {
  return res.json({ admin: req.user });
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(admins);
  } catch (err) {
    console.error("Get Admins Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch administrative accounts." });
  }
};

export const createAdmin = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields (username, email, password, role) are required." });
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid admin role classification." });
    }

    // Check availability
    const existingUsername = await prisma.admin.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already registered." });
    }

    const existingEmail = await prisma.admin.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email address is already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Admin
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await logActivity(req.user.id, "CREATE", "Admins", `Created administrative account: ${username}`, req);

    return res.status(201).json(newAdmin);
  } catch (err) {
    console.error("Create Admin Error:", err.message);
    return res.status(500).json({ error: "Failed to create new administrative account." });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Admin ID parameter." });
    }

    // Prevent self deletion
    if (id === req.user.id) {
      return res.status(400).json({ error: "Self-deletion is not permitted." });
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id },
      select: { username: true }
    });

    if (!targetAdmin) {
      return res.status(404).json({ error: "Administrative account not found." });
    }

    await prisma.admin.delete({
      where: { id },
    });

    await logActivity(req.user.id, "DELETE", "Admins", `Deleted administrative account: ${targetAdmin.username}`, req);

    return res.json({ message: "Admin account deleted successfully." });
  } catch (err) {
    console.error("Delete Admin Error:", err.message);
    return res.status(500).json({ error: "Failed to delete administrative account." });
  }
};
