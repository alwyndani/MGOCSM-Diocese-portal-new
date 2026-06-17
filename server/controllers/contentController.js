import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logActivity } from "../utils/logger.js";
import { sanitizeHTML } from "../utils/sanitizer.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to remove temporary local files uploaded by multer
const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete temporary local file: ${err.message}`);
    }
  }
};

// Helper to remove files (locally or from Cloudinary)
const removeFile = async (fileUrlOrObj, resourceType = "image") => {
  if (!fileUrlOrObj) return;

  // 1. If it's a string, it's a legacy local file path
  if (typeof fileUrlOrObj === "string") {
    if (!fileUrlOrObj.startsWith("/uploads/")) return;
    const fileName = fileUrlOrObj.replace("/uploads/", "");
    const filePath = path.resolve(__dirname, "../uploads", fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete local file ${fileName}:`, err.message);
      }
    }
    return;
  }

  // 2. If it's a Cloudinary metadata object
  if (typeof fileUrlOrObj === "object" && fileUrlOrObj !== null && fileUrlOrObj.publicId) {
    try {
      const type = fileUrlOrObj.resourceType || resourceType;
      await deleteFromCloudinary(fileUrlOrObj.publicId, type);
    } catch (err) {
      console.error(`Failed to delete Cloudinary file with publicId ${fileUrlOrObj.publicId}:`, err.message);
    }
  }
};

// Helper to generate URL-safe slugs
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")          // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start
    .replace(/-+$/, "");            // Trim - from end
};


/* =========================================================================
   1. KALPANA CRUD HANDLERS
   ========================================================================= */

// Public: Get visible Kalpanas
export const getKalpanas = async (req, res) => {
  try {
    const kalpanas = await prisma.kalpana.findMany({
      where: { isVisible: true },
      orderBy: [
        { displayOrder: "asc" },
        { publishedDate: "desc" }
      ],
    });
    return res.json(kalpanas);
  } catch (err) {
    console.error("Get Kalpanas Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch Kalpanas." });
  }
};

// Admin: Get all Kalpanas (paginated, search, filters)
export const adminGetKalpanas = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";
  const isVisible = req.query.isVisible;

  const skip = (page - 1) * limit;

  const whereClause = {
    AND: [
      {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } }
        ]
      }
    ]
  };

  if (isVisible === "true") {
    whereClause.AND.push({ isVisible: true });
  } else if (isVisible === "false") {
    whereClause.AND.push({ isVisible: false });
  }

  try {
    const total = await prisma.kalpana.count({ where: whereClause });
    const kalpanas = await prisma.kalpana.findMany({
      where: whereClause,
      orderBy: { displayOrder: "asc" },
      skip,
      take: limit,
    });

    return res.json({
      kalpanas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error("Admin Get Kalpanas Error:", err.message);
    return res.status(500).json({ error: "Failed to load Kalpana datasets." });
  }
};

// Create Kalpana
export const createKalpana = async (req, res) => {
  const { title, description, displayOrder, isVisible, publishedDate } = req.body;

  try {
    if (!title || !publishedDate) {
      return res.status(400).json({ error: "Title and Published Date are required." });
    }

    let documentUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "kalpanas", "auto");
      documentUrl = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    }

    const newKalpana = await prisma.kalpana.create({
      data: {
        title,
        description,
        documentUrl,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isVisible: isVisible === "true" || isVisible === true,
        publishedDate: new Date(publishedDate),
      },
    });

    await logActivity(req.user.id, "CREATE", "Kalpanas", `Added Kalpana: "${title}"`, req);

    return res.status(201).json(newKalpana);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Create Kalpana Error:", err.message);
    return res.status(500).json({ error: "Failed to create Kalpana." });
  }
};

// Update Kalpana
export const updateKalpana = async (req, res) => {
  const { id } = req.params;
  const { title, description, displayOrder, isVisible, publishedDate, removeDocument } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Kalpana ID." });
    }

    const currentKalpana = await prisma.kalpana.findUnique({
      where: { id }
    });

    if (!currentKalpana) {
      return res.status(404).json({ error: "Kalpana not found." });
    }

    let documentUrl = currentKalpana.documentUrl;

    if (req.file) {
      // Delete old file
      await removeFile(currentKalpana.documentUrl, "raw");
      const uploadResult = await uploadToCloudinary(req.file.path, "kalpanas", "auto");
      documentUrl = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    } else if (removeDocument === "true" || removeDocument === true) {
      await removeFile(currentKalpana.documentUrl, "raw");
      documentUrl = null;
    }

    const updatedKalpana = await prisma.kalpana.update({
      where: { id },
      data: {
        title: title || currentKalpana.title,
        description: description !== undefined ? description : currentKalpana.description,
        documentUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : currentKalpana.displayOrder,
        isVisible: isVisible !== undefined ? (isVisible === "true" || isVisible === true) : currentKalpana.isVisible,
        publishedDate: publishedDate ? new Date(publishedDate) : currentKalpana.publishedDate,
      },
    });

    await logActivity(req.user.id, "UPDATE", "Kalpanas", `Modified Kalpana: "${updatedKalpana.title}"`, req);

    return res.json(updatedKalpana);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Update Kalpana Error:", err.message);
    return res.status(500).json({ error: "Failed to update Kalpana." });
  }
};

// Delete Kalpana
export const deleteKalpana = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Kalpana ID." });
    }

    const currentKalpana = await prisma.kalpana.findUnique({
      where: { id }
    });

    if (!currentKalpana) {
      return res.status(404).json({ error: "Kalpana not found." });
    }

    // Unlink file
    await removeFile(currentKalpana.documentUrl, "raw");

    await prisma.kalpana.delete({
      where: { id }
    });

    await logActivity(req.user.id, "DELETE", "Kalpanas", `Deleted Kalpana: "${currentKalpana.title}"`, req);

    return res.json({ message: "Kalpana deleted successfully." });
  } catch (err) {
    console.error("Delete Kalpana Error:", err.message);
    return res.status(500).json({ error: "Failed to delete Kalpana." });
  }
};


/* =========================================================================
   2. TEAM MEMBERS CRUD HANDLERS
   ========================================================================= */

// Get all team members (Core, Presidents, Secretaries)
export const getTeamMembers = async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return res.json(members);
  } catch (err) {
    console.error("Get Team Members Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch leadership profiles." });
  }
};

// Create Team Member
export const createTeamMember = async (req, res) => {
  const { name, designation, category, district, contactEmail, contactPhone, displayOrder } = req.body;

  try {
    if (!name || !designation || !category) {
      return res.status(400).json({ error: "Name, Designation, and Category are required." });
    }

    if (!["CORE_LEADER", "DISTRICT_PRESIDENT", "DISTRICT_SECRETARY"].includes(category)) {
      return res.status(400).json({ error: "Invalid category definition." });
    }

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "team_members", "image");
      imageUrl = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    }

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        designation,
        category,
        district: district || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        imageUrl,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    await logActivity(req.user.id, "CREATE", "TeamMembers", `Added Team Member: "${name}" (${designation})`, req);

    return res.status(201).json(newMember);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Create Member Error:", err.message);
    return res.status(500).json({ error: "Failed to create profile." });
  }
};

// Update Team Member
export const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, designation, category, district, contactEmail, contactPhone, displayOrder, removeImage } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Member ID." });
    }

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({ error: "Leadership profile not found." });
    }

    let imageUrl = member.imageUrl;

    if (req.file) {
      await removeFile(member.imageUrl, "image");
      const uploadResult = await uploadToCloudinary(req.file.path, "team_members", "image");
      imageUrl = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    } else if (removeImage === "true" || removeImage === true) {
      await removeFile(member.imageUrl, "image");
      imageUrl = null;
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name || member.name,
        designation: designation || member.designation,
        category: category || member.category,
        district: district !== undefined ? district : member.district,
        contactEmail: contactEmail !== undefined ? contactEmail : member.contactEmail,
        contactPhone: contactPhone !== undefined ? contactPhone : member.contactPhone,
        imageUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : member.displayOrder,
      },
    });

    await logActivity(req.user.id, "UPDATE", "TeamMembers", `Updated Team Member details for: "${updated.name}"`, req);

    return res.json(updated);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Update Member Error:", err.message);
    return res.status(500).json({ error: "Failed to update profile." });
  }
};

// Delete Team Member
export const deleteTeamMember = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Member ID." });
    }

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({ error: "Leadership profile not found." });
    }

    await removeFile(member.imageUrl, "image");

    await prisma.teamMember.delete({ where: { id } });

    await logActivity(req.user.id, "DELETE", "TeamMembers", `Deleted Team Member: "${member.name}"`, req);

    return res.json({ message: "Leadership profile deleted successfully." });
  } catch (err) {
    console.error("Delete Member Error:", err.message);
    return res.status(500).json({ error: "Failed to delete profile." });
  }
};


/* =========================================================================
   3. EVENTS CRUD HANDLERS
   ========================================================================= */

// Public: Get published events
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: "desc" },
    });
    return res.json(events);
  } catch (err) {
    console.error("Get Events Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch events." });
  }
};

// Admin: Get all events (paginated + search)
export const adminGetEvents = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  try {
    const total = await prisma.event.count({
      where: {
        OR: [
          { id: { contains: search } },
          { title: { contains: search } },
          { location: { contains: search } },
        ]
      }
    });

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { id: { contains: search } },
          { title: { contains: search } },
          { location: { contains: search } },
        ]
      },
      include: {
        _count: {
          select: { galleryMedia: true }
        }
      },
      orderBy: { eventDate: "desc" },
      skip,
      take: limit,
    });

    return res.json({
      events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error("Admin Get Events Error:", err.message);
    return res.status(500).json({ error: "Failed to load events lists." });
  }
};

// Create Event
export const createEvent = async (req, res) => {
  const { title, description, eventDate, location, isPublished } = req.body;

  try {
    if (!title || !eventDate) {
      return res.status(400).json({ error: "Title and Event Date are required." });
    }

    // Generate unique slug-based ID
    const eventId = generateSlug(title);

    // Check availability
    const duplicate = await prisma.event.findUnique({ where: { id: eventId } });
    if (duplicate) {
      return res.status(400).json({ error: "An event with this name/slug already exists." });
    }

    let featuredImage = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "events", "image");
      featuredImage = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    }

    const newEvent = await prisma.event.create({
      data: {
        id: eventId,
        title,
        description,
        eventDate: new Date(eventDate),
        location: location || null,
        featuredImage,
        isPublished: isPublished === "true" || isPublished === true,
      },
    });

    await logActivity(req.user.id, "CREATE", "Events", `Created Event: "${title}"`, req);

    return res.status(201).json(newEvent);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Create Event Error:", err.message);
    return res.status(500).json({ error: "Failed to create event." });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  const { id } = req.params; // Event Slug ID
  const { title, description, eventDate, location, isPublished, removeImage } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    let featuredImage = event.featuredImage;

    if (req.file) {
      await removeFile(event.featuredImage, "image");
      const uploadResult = await uploadToCloudinary(req.file.path, "events", "image");
      featuredImage = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    } else if (removeImage === "true" || removeImage === true) {
      await removeFile(event.featuredImage, "image");
      featuredImage = null;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title || event.title,
        description: description !== undefined ? description : event.description,
        eventDate: eventDate ? new Date(eventDate) : event.eventDate,
        location: location !== undefined ? location : event.location,
        featuredImage,
        isPublished: isPublished !== undefined ? (isPublished === "true" || isPublished === true) : event.isPublished,
      },
    });

    await logActivity(req.user.id, "UPDATE", "Events", `Updated Event: "${updated.title}"`, req);

    return res.json(updated);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Update Event Error:", err.message);
    return res.status(500).json({ error: "Failed to update event." });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  const { id } = req.params; // Event Slug ID

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { galleryMedia: true }
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Remove featured image
    await removeFile(event.featuredImage, "image");

    // Remove all associated gallery files on disk/Cloudinary
    for (const item of event.galleryMedia) {
      await removeFile(item.mediaUrl, item.type === "VIDEO" ? "video" : "image");
    }

    // Delete event (Prisma Cascade will delete GalleryMedia records)
    await prisma.event.delete({ where: { id } });

    await logActivity(req.user.id, "DELETE", "Events", `Deleted Event: "${event.title}"`, req);

    return res.json({ message: "Event and all associated media deleted successfully." });
  } catch (err) {
    console.error("Delete Event Error:", err.message);
    return res.status(500).json({ error: "Failed to delete event." });
  }
};


/* =========================================================================
   4. GALLERY MEDIA CRUD HANDLERS
   ========================================================================= */

// Get media for a specific event
export const getGalleryMedia = async (req, res) => {
  const { eventId } = req.params;

  try {
    const media = await prisma.galleryMedia.findMany({
      where: { eventId },
      orderBy: { displayOrder: "asc" },
    });
    return res.json(media);
  } catch (err) {
    console.error("Get Gallery Media Error:", err.message);
    return res.status(500).json({ error: "Failed to load event media content." });
  }
};

// Upload multiple images/videos OR link external URLs
export const uploadGalleryMedia = async (req, res) => {
  const { eventId } = req.params;
  const { externalUrl, mediaType, caption, displayOrder } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      if (req.files) req.files.forEach(file => removeLocalFile(file.path));
      return res.status(404).json({ error: "Event does not exist." });
    }

    // Determine highest current order
    const maxOrderRecord = await prisma.galleryMedia.findFirst({
      where: { eventId },
      orderBy: { displayOrder: "desc" },
    });
    const nextOrder = (maxOrderRecord?.displayOrder || 0) + 1;

    // Handle File Uploads (Multiple files support via multer array)
    if (req.files && req.files.length > 0) {
      const records = [];
      let orderIndex = nextOrder;

      for (const file of req.files) {
        try {
          // Simple type check
          const ext = path.extname(file.originalname).toLowerCase();
          const isVideo = [".mp4", ".mov", ".mkv"].includes(ext);
          const type = isVideo ? "VIDEO" : "IMAGE";
          const resourceType = isVideo ? "video" : "image";

          const uploadResult = await uploadToCloudinary(file.path, "gallery", resourceType);

          const rec = await prisma.galleryMedia.create({
            data: {
              eventId,
              type,
              mediaUrl: {
                imageUrl: uploadResult.imageUrl,
                publicId: uploadResult.publicId,
                resourceType: uploadResult.resourceType
              },
              title: file.originalname,
              displayOrder: orderIndex++,
            }
          });
          records.push(rec);
        } finally {
          removeLocalFile(file.path);
        }
      }

      await logActivity(req.user.id, "CREATE", "Gallery", `Uploaded ${records.length} files to event "${event.title}"`, req);
      return res.status(201).json(records);
    }

    // Handle Single External URL (e.g. YouTube video or external image link)
    if (externalUrl) {
      if (!mediaType || !["IMAGE", "VIDEO"].includes(mediaType)) {
        return res.status(400).json({ error: "Media type classification (IMAGE/VIDEO) is required for external URLs." });
      }

      const rec = await prisma.galleryMedia.create({
        data: {
          eventId,
          type: mediaType,
          mediaUrl: externalUrl, // keep as external url string
          title: caption || null,
          displayOrder: parseInt(displayOrder, 10) || nextOrder,
        }
      });

      await logActivity(req.user.id, "CREATE", "Gallery", `Added link to event "${event.title}": ${externalUrl}`, req);
      return res.status(201).json(rec);
    }

    return res.status(400).json({ error: "No media files uploaded or links provided." });
  } catch (err) {
    if (req.files) req.files.forEach(file => removeLocalFile(file.path));
    console.error("Upload Media Error:", err.message);
    return res.status(500).json({ error: "Failed to upload gallery media." });
  }
};

// Delete specific media item
export const deleteGalleryMedia = async (req, res) => {
  const { mediaId } = req.params;

  try {
    if (!mediaId) {
      return res.status(400).json({ error: "Invalid media record ID." });
    }

    const item = await prisma.galleryMedia.findUnique({
      where: { id: mediaId },
      include: { event: true }
    });

    if (!item) {
      return res.status(404).json({ error: "Gallery media record not found." });
    }

    // Delete file from disk/Cloudinary
    await removeFile(item.mediaUrl, item.type === "VIDEO" ? "video" : "image");

    // Delete record
    await prisma.galleryMedia.delete({ where: { id: mediaId } });

    await logActivity(req.user.id, "DELETE", "Gallery", `Deleted media asset from event: "${item.event.title}"`, req);

    return res.json({ message: "Media record deleted successfully." });
  } catch (err) {
    console.error("Delete Media Error:", err.message);
    return res.status(500).json({ error: "Failed to delete media asset." });
  }
};


/* =========================================================================
   5. ARTICLES CRUD HANDLERS
   ========================================================================= */

// Public: Get published articles
export const getArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishDate: "desc" },
    });
    return res.json(articles);
  } catch (err) {
    console.error("Get Articles Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch articles." });
  }
};

// Public: Fetch single article details
export const getArticleBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.json(article);
  } catch (err) {
    console.error("Get Article Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch article details." });
  }
};

// Admin: Get all articles (paginated + search)
export const adminGetArticles = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";
  const status = req.query.status;

  const skip = (page - 1) * limit;

  const whereClause = {
    OR: [
      { title: { contains: search } },
      { authorName: { contains: search } },
    ]
  };

  if (status) {
    whereClause.status = status;
  }

  try {
    const total = await prisma.article.count({ where: whereClause });
    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { publishDate: "desc" },
      skip,
      take: limit,
    });

    return res.json({
      articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error("Admin Get Articles Error:", err.message);
    return res.status(500).json({ error: "Failed to load articles." });
  }
};

// Create Article
export const createArticle = async (req, res) => {
  const { title, content, authorName, category, status, publishDate } = req.body;

  try {
    if (!title || !content || !authorName) {
      return res.status(400).json({ error: "Title, content, and author name are required fields." });
    }

    const slug = generateSlug(title);
    
    // Check slug duplication
    const duplicate = await prisma.article.findUnique({ where: { slug } });
    if (duplicate) {
      return res.status(400).json({ error: "An article with this title (or URL slug) already exists." });
    }

    // Sanitize the HTML rich-text
    const cleanContent = sanitizeHTML(content);

    let featuredImage = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "articles", "image");
      featuredImage = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug,
        content: cleanContent,
        featuredImage,
        authorName,
        category: category || null,
        status: status || "DRAFT",
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      },
    });

    await logActivity(req.user.id, "CREATE", "Articles", `Created Article: "${title}"`, req);

    return res.status(201).json(newArticle);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Create Article Error:", err.message);
    return res.status(500).json({ error: "Failed to write article." });
  }
};

// Update Article
export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, authorName, category, status, publishDate, removeImage } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Article ID." });
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    let featuredImage = article.featuredImage;

    if (req.file) {
      await removeFile(article.featuredImage, "image");
      const uploadResult = await uploadToCloudinary(req.file.path, "articles", "image");
      featuredImage = {
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        resourceType: uploadResult.resourceType
      };
      removeLocalFile(req.file.path);
    } else if (removeImage === "true" || removeImage === true) {
      await removeFile(article.featuredImage, "image");
      featuredImage = null;
    }

    // If title changed, generate new slug
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = generateSlug(title);
      const duplicate = await prisma.article.findFirst({
        where: { slug, NOT: { id } }
      });
      if (duplicate) {
        return res.status(400).json({ error: "An article with this updated title (or URL slug) already exists." });
      }
    }

    const cleanContent = content !== undefined ? sanitizeHTML(content) : article.content;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title || article.title,
        slug,
        content: cleanContent,
        featuredImage,
        authorName: authorName || article.authorName,
        category: category !== undefined ? category : article.category,
        status: status || article.status,
        publishDate: publishDate ? new Date(publishDate) : article.publishDate,
      },
    });

    await logActivity(req.user.id, "UPDATE", "Articles", `Updated Article: "${updated.title}"`, req);

    return res.json(updated);
  } catch (err) {
    if (req.file) removeLocalFile(req.file.path);
    console.error("Update Article Error:", err.message);
    return res.status(500).json({ error: "Failed to update article." });
  }
};

// Delete Article
export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid Article ID." });
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    await removeFile(article.featuredImage, "image");

    await prisma.article.delete({ where: { id } });

    await logActivity(req.user.id, "DELETE", "Articles", `Deleted Article: "${article.title}"`, req);

    return res.json({ message: "Article deleted successfully." });
  } catch (err) {
    console.error("Delete Article Error:", err.message);
    return res.status(500).json({ error: "Failed to delete article." });
  }
};
