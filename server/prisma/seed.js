import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper function to safely copy asset and return the URL path
function copyAsset(fileName) {
  if (!fileName) return null;
  
  // Clean up filenames and handle potential extensions
  const srcPath = path.join(ASSETS_DIR, fileName);
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, path.join(UPLOADS_DIR, fileName));
      return `/uploads/${fileName}`;
    } catch (err) {
      console.error(`Error copying ${fileName}:`, err);
    }
  }
  
  // If file doesn't exist, search for it with case insensitivity or return relative placeholder path
  const files = fs.readdirSync(ASSETS_DIR);
  const matched = files.find(f => f.toLowerCase() === fileName.toLowerCase());
  if (matched) {
    try {
      fs.copyFileSync(path.join(ASSETS_DIR, matched), path.join(UPLOADS_DIR, matched));
      return `/uploads/${matched}`;
    } catch (err) {
      console.error(`Error copying matched file ${matched}:`, err);
    }
  }
  
  return `/uploads/${fileName}`; // Fallback DB path reference
}

async function main() {
  console.log("Seeding started...");

  // 1. Create Super Admin
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@mgocsmthumpamon.org",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Created admin account:", admin.username);

  // 2. Seed Kalpanas
  await prisma.kalpana.create({
    data: {
      title: "Kalpana No. 124/2026 - Diocesan General Assembly Meeting",
      description: "Official Kalpana regarding the scheduling of the Diocesan General Assembly meeting at the Cathedral Hall.",
      displayOrder: 1,
      isVisible: true,
      publishedDate: new Date("2026-05-15"),
    }
  });

  await prisma.kalpana.create({
    data: {
      title: "Kalpana No. 98/2026 - Reconstitution of MGOCSM Diocesan Committee",
      description: "Official announcement regarding the newly elected office bearers of the MGOCSM Diocese of Thumpamon.",
      displayOrder: 2,
      isVisible: true,
      publishedDate: new Date("2026-04-10"),
    }
  });
  console.log("Seeded mock Kalpanas");

  // 3. Seed Team Members (Core Leadership, Presidents, Secretaries)
  const coreLeaders = [
    { name: "H.G. Dr. Abraham Mar Seraphim Metropolitan of Thumpamon Diocese", designation: "President, MGOCSM Diocese of Thumpamon & MGOCSM Global", category: "CORE_LEADER", image: "leader1.jpeg", displayOrder: 1 },
    { name: "Rev. Fr. Rijosh George", designation: "Vice-President, MGOCSM Diocese of Thumpamon", category: "CORE_LEADER", image: "leader2.jpeg", displayOrder: 2 },
    { name: "Dr. Jomy Linu", designation: "General Secretary, MGOCSM Diocese of Thumpamon", category: "CORE_LEADER", image: "leader3.jpeg", displayOrder: 3 },
  ];

  const presidents = [
    { name: "Rev. Fr. Abin Mathew", designation: "Thumpamon District President", category: "DISTRICT_PRESIDENT", district: "Thumpamon", image: "pres3.jpeg", displayOrder: 4 },
    { name: "Fr. Ck. Thomas", designation: "Omalloor District President", category: "DISTRICT_PRESIDENT", district: "Omalloor", image: "pres7.jpeg", displayOrder: 5 },
    { name: "Rev. Fr. Rijo Sunny Varghese", designation: "Makkamkunnu District President", category: "DISTRICT_PRESIDENT", district: "Makkamkunnu", image: "pres2.jpeg", displayOrder: 6 },
    { name: "Rev. Fr. Jithu Thomas", designation: "Vakayar District President", category: "DISTRICT_PRESIDENT", district: "Vakayar", image: "pres1.jpeg", displayOrder: 7 },
    { name: "Rev. Fr. Prince CM", designation: "Thannithode District President", category: "DISTRICT_PRESIDENT", district: "Thannithode", image: "pres6.jpeg", displayOrder: 8 },
    { name: "Rev. Fr. Alex Mathews", designation: "Konni District President", category: "DISTRICT_PRESIDENT", district: "Konni", image: "pres5.jpeg", displayOrder: 9 },
    { name: "Rev. Fr. Liju P Jose", designation: "Kozhencherry District President", category: "DISTRICT_PRESIDENT", district: "Kozhencherry", image: "pres4.jpeg", displayOrder: 10 },
  ];

  const secretaries = [
    { name: "Gregori Shibu", designation: "Thumpamon District Secretary", category: "DISTRICT_SECRETARY", district: "Thumpamon", image: "secre5.jpeg", displayOrder: 11 },
    { name: "Joshvin Jose", designation: "Omalloor District Secretary", category: "DISTRICT_SECRETARY", district: "Omalloor", image: "secre6.jpeg", displayOrder: 12 },
    { name: "Aaron George Koshy", designation: "Omalloor District Secretary", category: "DISTRICT_SECRETARY", district: "Omalloor", image: "secre9.jpeg", displayOrder: 13 },
    { name: "Anju S Thudiyil", designation: "Makkamkunnu District Secretary", category: "DISTRICT_SECRETARY", district: "Makkamkunnu", image: "secre4.jpeg", displayOrder: 14 },
    { name: "Rojan Reji", designation: "Makkamkunnu District Secretary", category: "DISTRICT_SECRETARY", district: "Makkamkunnu", image: "secre7.jpeg", displayOrder: 15 },
    { name: "Dinu S Sunil", designation: "Vakayar District Secretary", category: "DISTRICT_SECRETARY", district: "Vakayar", image: "secre3.jpeg", displayOrder: 16 },
    { name: "Anto P Binu", designation: "Thannithode District Secretary", category: "DISTRICT_SECRETARY", district: "Thannithode", image: "secre2.jpeg", displayOrder: 17 },
    { name: "Cibin Cinub", designation: "Konni District Secretary", category: "DISTRICT_SECRETARY", district: "Konni", image: "secre8.jpeg", displayOrder: 18 },
    { name: "Bijo Babu", designation: "Konni District Secretary", category: "DISTRICT_SECRETARY", district: "Konni", image: "secre1.jpeg", displayOrder: 19 },
  ];

  for (const m of [...coreLeaders, ...presidents, ...secretaries]) {
    const dbImagePath = copyAsset(m.image);
    await prisma.teamMember.create({
      data: {
        name: m.name,
        designation: m.designation,
        category: m.category,
        district: m.district || null,
        imageUrl: dbImagePath,
        displayOrder: m.displayOrder,
      }
    });
  }
  console.log("Seeded team members and copied images.");

  // 4. Seed Events & Gallery Media
  const events = [
    { id: "Silentium 2K25", title: "Silentium 2K25", date: "2025-03-01", image: "silentium.jpeg", location: "St. Mary's Cathedral Hall", description: "Diocesan level spiritual conference focusing on inner silence and prayer." },
    { id: "Educa", title: "Educa", date: "2025-01-15", image: "educa.jpeg", location: "Mount Tabore Academy", description: "Educational scholarship distribution and career guidance program." },
    { id: "PonnonaPunchiri", title: "പൊന്നോണ പുഞ്ചിരി", date: "2024-12-10", image: "ponnonapunchiri.jpeg", location: "Parumala Seminary", description: "Onam celebrations with members of local old age care centers." },
    { id: "Oppam", title: "ഒപ്പം", date: "2024-11-20", image: "oppam.jpeg", location: "Kozhencherry Center", description: "Fellowship program with marginalized communities." },
    { id: "PraiseinAction", title: "Praise in Action", date: "2024-10-15", image: "praiseIA.jpeg", location: "St. John's Cathedral", description: "Annual gospel choir and musical worship session." },
    { id: "Swamanaya", title: "സമന്വയ", date: "2024-09-05", image: "swamanaya.jpeg", location: "Konni Hall", description: "Diocesan leadership workshop." },
    { id: "examFavour", title: "Exam Favour", date: "2024-08-15", image: "examFavour.jpeg", location: "Pathanamthitta", description: "Exam preparation and academic blessing service." },
    { id: "Smaranika", title: "സ്മരണിക", date: "2024-07-20", image: "smaranika1.jpeg", location: "Omalloor", description: "Smaranika magazine release ceremony." },
    { id: "UnitVisits", title: "Unit Visits", date: "2024-06-12", image: "unitVisit.jpeg", location: "Various Parishes", description: "Diocesan leadership visits to local parish units." },
    { id: "snehaThanalil", title: "സ്നേഹത്തണലിൽ ഇത്തിരി നേരം", date: "2024-06-05", image: "snehaThanalil.jpg", location: "Thumpamon Diocese", description: "Outreach program spending time at homes of homebound elderly." },
  ];

  for (const e of events) {
    const featuredImgPath = copyAsset(e.image);
    await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        eventDate: new Date(e.date),
        featuredImage: featuredImgPath,
        location: e.location,
        description: e.description,
        isPublished: true,
      }
    });
  }
  console.log("Seeded events.");

  // Seed Event Media (Images and Videos)
  const mediaDetails = {
    "Silentium 2K25": {
      images: ["silentium1.jpeg", "silentium2.jpeg"],
      videos: ["silentiumV1.mp4", "silentiumV2.mp4", "silentiumV3.mp4", "silentiumV4.mp4"],
    },
    "Educa": {
      images: ["educa.jpeg", "educa-1.jpeg", "educa2.jpeg", "educa3.jpeg", "educa4.jpeg", "educa5.jpeg", "educa6.jpeg", "educa7.jpeg", "educa8.jpeg", "educa9.jpeg"],
      videos: ["eduV1.mp4"],
    },
    "PonnonaPunchiri": {
      images: ["ponnonapunchiri1.jpeg"],
      videos: ["ponnonaV1.mp4"],
    },
    "PraiseinAction": {
      images: ["praise1.jpeg", "praise2.jpeg", "praise3.jpeg", "praise4.jpeg", "praise5.jpeg", "praise6.jpeg", "praise7.jpeg", "praise8.jpeg", "praise9.jpeg", "praise10.jpeg", "praise11.jpeg", "praise12.jpeg", "praise13.jpeg", "praise14.jpeg", "praise15.jpeg", "praise16.jpeg", "praise17.jpeg"],
      videos: ["praiseV1.mp4", "praiseV2.mp4", "praiseV3.mp4"],
    },
    "Swamanaya": {
      images: ["swamanaya2.jpeg", "swamanaya3.jpeg", "swamanaya4.jpeg", "swamanaya5.jpeg", "swamanaya6.jpeg", "swamanaya7.jpeg", "swamanaya8.jpeg", "swamanaya9.jpeg", "swamanaya10.jpeg", "swamanaya11.jpeg"],
      videos: ["swamanayaV1.mp4"],
    },
    "examFavour": {
      images: ["examFavour1.jpeg", "examFavour2.jpeg", "examFavour3.jpeg", "examFavour4.jpeg"],
      videos: [],
    },
    "Oppam": {
      images: ["oppam1.jpeg", "oppam2.jpeg", "oppam3.jpeg", "oppam4.jpeg"],
      videos: ["oppamV1.mp4"],
    },
    "Smaranika": {
      images: ["smaranika1.jpeg", "smaranika2.jpeg", "smaranika3.jpeg", "smaranika4.jpeg"],
      videos: [],
    },
    "UnitVisits": {
      images: ["UnitV1.jpeg", "UnitV2.jpeg", "UnitV3.jpeg", "UnitV4.jpeg", "UnitV5.jpeg", "UnitV6.jpeg", "UnitV7.jpeg", "UnitV8.jpeg", "UnitV9.jpeg", "UnitV10.jpeg", "UnitV11.jpeg", "UnitV12.jpeg", "UnitV13.jpeg", "UnitV14.jpeg", "UnitV15.jpeg", "UnitV16.jpeg", "UnitV17.jpeg", "UnitV18.jpeg"],
      videos: ["UnitV1.mp4", "UnitV2.mp4", "UnitV3.mp4"],
    },
    "snehaThanalil": {
      images: [],
      videos: ["snehaThanalilV1.mp4", "snehaThanalilV2.mp4"],
    }
  };

  for (const [eventId, media] of Object.entries(mediaDetails)) {
    let order = 0;
    
    // Check if event exists
    const eventExists = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventExists) continue;

    for (const img of media.images) {
      const dbImgPath = copyAsset(img);
      await prisma.galleryMedia.create({
        data: {
          eventId,
          type: "IMAGE",
          mediaUrl: dbImgPath,
          displayOrder: ++order,
        }
      });
    }

    for (const vid of media.videos) {
      const dbVidPath = copyAsset(vid);
      await prisma.galleryMedia.create({
        data: {
          eventId,
          type: "VIDEO",
          mediaUrl: dbVidPath,
          displayOrder: ++order,
        }
      });
    }
  }
  console.log("Seeded event gallery media.");

  // 5. Seed Mock Articles
  await prisma.article.create({
    data: {
      title: "Orthodox Spirituality in the 21st Century",
      slug: "orthodox-spirituality-21st-century",
      content: "<p>Orthodox spirituality is fundamentally therapeutic in its approach. This article explores how the ancient prayer practices of the church offer solace in our fast-paced modern world...</p>",
      featuredImage: "/uploads/silentium.jpeg",
      authorName: "Rev. Fr. Rijosh George",
      category: "Spiritual",
      status: "PUBLISHED",
      publishDate: new Date("2026-05-01"),
    }
  });

  await prisma.article.create({
    data: {
      title: "The Motto: Worship, Study, Service",
      slug: "motto-worship-study-service",
      content: "<p>The core values of MGOCSM revolve around three pillars: Worship, Study, and Service. By understanding these concepts, our students find their spiritual compass...</p>",
      featuredImage: "/uploads/educa.jpeg",
      authorName: "Dr. Jomy Linu",
      category: "Theological",
      status: "PUBLISHED",
      publishDate: new Date("2026-05-10"),
    }
  });
  console.log("Seeded articles.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
