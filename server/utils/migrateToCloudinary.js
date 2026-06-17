import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

/**
 * Retries an async function if it fails due to database/network connection drops.
 */
const runWithRetry = async (fn, retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`⚠️  Database operation failed (attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

/**
 * Uploads a local file to Cloudinary if it exists.
 * @param {string} localPath - Relative local path, e.g. "/uploads/file.png".
 * @param {string} folder - Destination Cloudinary folder.
 * @param {string} defaultResourceType - Default resource type (auto, image, video, raw).
 * @returns {Promise<{imageUrl: string, publicId: string, resourceType: string}|null>}
 */
const uploadLocalFile = async (localPath, folder, defaultResourceType = "auto") => {
  if (!localPath || typeof localPath !== "string" || !localPath.startsWith("/uploads/")) {
    return null;
  }

  const fileName = localPath.replace("/uploads/", "");
  const fullPath = path.join(UPLOADS_DIR, fileName);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Local file does not exist: ${fullPath}. Skipping upload.`);
    return null;
  }

  try {
    console.log(`📤 Uploading ${fileName} to Cloudinary folder "${folder}"...`);
    const result = await cloudinary.v2.uploader.upload(fullPath, {
      folder: folder,
      resource_type: defaultResourceType,
    });
    console.log(`✅ Uploaded: ${result.secure_url}`);
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  } catch (err) {
    console.error(`❌ Failed to upload ${fileName} to Cloudinary:`, err.message);
    return null;
  }
};

async function runMigration() {
  console.log("🚀 Starting Cloudinary Media Migration (with auto-retry support)...");

  // 1. Migrate Kalpanas
  console.log("\n--- Migrating Kalpanas ---");
  const kalpanas = await runWithRetry(() => prisma.kalpana.findMany());
  for (const k of kalpanas) {
    if (k.documentUrl && typeof k.documentUrl === "string") {
      const metadata = await uploadLocalFile(k.documentUrl, "kalpanas", "auto");
      if (metadata) {
        await runWithRetry(() => prisma.kalpana.update({
          where: { id: k.id },
          data: { documentUrl: metadata },
        }));
      }
    }
  }

  // 2. Migrate Team Members
  console.log("\n--- Migrating Team Members ---");
  const members = await runWithRetry(() => prisma.teamMember.findMany());
  for (const m of members) {
    if (m.imageUrl && typeof m.imageUrl === "string") {
      const metadata = await uploadLocalFile(m.imageUrl, "team_members", "image");
      if (metadata) {
        await runWithRetry(() => prisma.teamMember.update({
          where: { id: m.id },
          data: { imageUrl: metadata },
        }));
      }
    }
  }

  // 3. Migrate Events
  console.log("\n--- Migrating Events ---");
  const events = await runWithRetry(() => prisma.event.findMany());
  for (const e of events) {
    if (e.featuredImage && typeof e.featuredImage === "string") {
      const metadata = await uploadLocalFile(e.featuredImage, "events", "image");
      if (metadata) {
        await runWithRetry(() => prisma.event.update({
          where: { id: e.id },
          data: { featuredImage: metadata },
        }));
      }
    }
  }

  // 4. Migrate Gallery Media
  console.log("\n--- Migrating Gallery Media ---");
  const gallery = await runWithRetry(() => prisma.galleryMedia.findMany());
  for (const g of gallery) {
    if (g.mediaUrl && typeof g.mediaUrl === "string") {
      // Skip external links like YouTube
      if (g.mediaUrl.startsWith("http")) {
        console.log(`ℹ️  Skipping external video link: ${g.mediaUrl}`);
        continue;
      }
      const resourceType = g.type.toLowerCase() === "video" ? "video" : "image";
      const metadata = await uploadLocalFile(g.mediaUrl, "gallery", resourceType);
      if (metadata) {
        await runWithRetry(() => prisma.galleryMedia.update({
          where: { id: g.id },
          data: { mediaUrl: metadata },
        }));
      }
    }
  }

  // 5. Migrate Articles
  console.log("\n--- Migrating Articles ---");
  const articles = await runWithRetry(() => prisma.article.findMany());
  for (const a of articles) {
    if (a.featuredImage && typeof a.featuredImage === "string") {
      const metadata = await uploadLocalFile(a.featuredImage, "articles", "image");
      if (metadata) {
        await runWithRetry(() => prisma.article.update({
          where: { id: a.id },
          data: { featuredImage: metadata },
        }));
      }
    }
  }

  console.log("\n🎉 Migration finished!");
}

runMigration()
  .catch((err) => {
    console.error("❌ Migration failed with error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
