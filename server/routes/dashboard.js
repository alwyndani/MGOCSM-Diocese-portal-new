import { Router } from "express";
import { getStats, getActivityLogs } from "../controllers/dashboardController.js";
import { requireAuth, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", requireAuth, getStats);
router.get("/logs", requireAuth, requireSuperAdmin, getActivityLogs);

export default router;
