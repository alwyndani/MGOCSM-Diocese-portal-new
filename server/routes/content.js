import { Router } from "express";
import { 
  getKalpanas, adminGetKalpanas, createKalpana, updateKalpana, deleteKalpana,
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
  getEvents, adminGetEvents, createEvent, updateEvent, deleteEvent,
  getGalleryMedia, uploadGalleryMedia, deleteGalleryMedia,
  getArticles, getArticleBySlug, adminGetArticles, createArticle, updateArticle, deleteArticle
} from "../controllers/contentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { sendPrayerEmail } from "../utils/emailService.js";

const router = Router();

/* =========================================================================
   Kalpana Module
   ========================================================================= */
router.get("/kalpanas", getKalpanas);
router.get("/kalpanas/admin", requireAuth, adminGetKalpanas);
router.post("/kalpanas", requireAuth, upload.single("file"), createKalpana);
router.put("/kalpanas/:id", requireAuth, upload.single("file"), updateKalpana);
router.delete("/kalpanas/:id", requireAuth, deleteKalpana);

/* =========================================================================
   Team Members (Leadership) Module
   ========================================================================= */
router.get("/team-members", getTeamMembers);
router.post("/team-members", requireAuth, upload.single("image"), createTeamMember);
router.put("/team-members/:id", requireAuth, upload.single("image"), updateTeamMember);
router.delete("/team-members/:id", requireAuth, deleteTeamMember);

/* =========================================================================
   Events Module
   ========================================================================= */
router.get("/events", getEvents);
router.get("/events/admin", requireAuth, adminGetEvents);
router.post("/events", requireAuth, upload.single("image"), createEvent);
router.put("/events/:id", requireAuth, upload.single("image"), updateEvent);
router.delete("/events/:id", requireAuth, deleteEvent);

/* =========================================================================
   Gallery Media Module
   ========================================================================= */
router.get("/gallery/:eventId", getGalleryMedia);
router.post("/gallery/:eventId/upload", requireAuth, upload.array("files", 12), uploadGalleryMedia);
router.delete("/gallery/media/:mediaId", requireAuth, deleteGalleryMedia);

/* =========================================================================
   Articles Module
   ========================================================================= */
router.get("/articles", getArticles);
router.get("/articles/item/:slug", getArticleBySlug);
router.get("/articles/admin", requireAuth, adminGetArticles);
router.post("/articles", requireAuth, upload.single("image"), createArticle);
router.put("/articles/:id", requireAuth, upload.single("image"), updateArticle);
router.delete("/articles/:id", requireAuth, deleteArticle);

/* =========================================================================
   Prayer Requests Module
   ========================================================================= */
router.post("/prayer-request", async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;

  // Trim and check required fields
  const cleanName = name?.toString().trim();
  const cleanMessage = message?.toString().trim();
  const cleanEmail = email?.toString().trim();
  const cleanPhone = phoneNumber?.toString().trim();

  if (!cleanName || !cleanMessage) {
    return res.status(400).json({ error: "Name and Prayer Request message are required fields." });
  }

  // Validate email format if provided
  if (cleanEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address format." });
    }
  }

  // Spam protection limits
  if (cleanName.length > 150) {
    return res.status(400).json({ error: "Name field exceeds maximum allowed length." });
  }
  if (cleanMessage.length > 8000) {
    return res.status(400).json({ error: "Prayer Request content exceeds length limits (8000 characters)." });
  }
  if (cleanPhone && cleanPhone.length > 30) {
    return res.status(400).json({ error: "Phone number is invalid." });
  }

  try {
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const result = await sendPrayerEmail({
      name: cleanName,
      email: cleanEmail || null,
      phoneNumber: cleanPhone || null,
      message: cleanMessage,
      timestamp,
    });

    return res.json({ 
      message: "Your prayer request has been submitted successfully.",
      success: result.success
    });
  } catch (err) {
    console.error("Prayer Mail Send Error:", err.message);
    return res.status(500).json({ error: "Failed to forward your prayer request. Please try again later." });
  }
});

export default router;
