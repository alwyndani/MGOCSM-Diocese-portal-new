import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get count statistics for the dashboard
export const getStats = async (req, res) => {
  try {
    const [
      totalKalpanas,
      totalTeamMembers,
      totalEvents,
      totalGalleryMedia,
      totalArticles,
    ] = await Promise.all([
      prisma.kalpana.count(),
      prisma.teamMember.count(),
      prisma.event.count(),
      prisma.galleryMedia.count(),
      prisma.article.count(),
    ]);

    // Group team members by category
    const memberGroups = await prisma.teamMember.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
    });

    const categories = memberGroups.reduce((acc, current) => {
      acc[current.category] = current._count.id;
      return acc;
    }, { CORE_LEADER: 0, DISTRICT_PRESIDENT: 0, DISTRICT_SECRETARY: 0 });

    return res.json({
      stats: {
        kalpanas: totalKalpanas,
        teamMembers: totalTeamMembers,
        events: totalEvents,
        galleryItems: totalGalleryMedia,
        articles: totalArticles,
        leadersBreakdown: categories,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    return res.status(500).json({ error: "Failed to compile system statistics." });
  }
};

// Get activity logs (Super Admin auditing)
export const getActivityLogs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.activityLog.count();
    
    const logs = await prisma.activityLog.findMany({
      include: {
        admin: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      skip,
      take: limit,
    });

    return res.json({
      logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get Activity Logs Error:", err.message);
    return res.status(500).json({ error: "Failed to retrieve system activity logs." });
  }
};
