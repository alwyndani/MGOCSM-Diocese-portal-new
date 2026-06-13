import { Router } from "express";
import { 
  login, 
  logout, 
  me, 
  getAdmins, 
  createAdmin, 
  deleteAdmin 
} from "../controllers/authController.js";
import { requireAuth, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

// Admin account management routes (restricted to Super Admins)
router.get("/admins", requireAuth, requireSuperAdmin, getAdmins);
router.post("/admins", requireAuth, requireSuperAdmin, createAdmin);
router.delete("/admins/:id", requireAuth, requireSuperAdmin, deleteAdmin);

export default router;
