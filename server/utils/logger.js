import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Logs administrative actions to the activity_logs table.
 * @param {number|null} adminId - The ID of the authenticated administrator
 * @param {string} action - 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
 * @param {string} module - 'Kalpanas', 'TeamMembers', 'Events', 'Gallery', 'Articles', 'Admins'
 * @param {string} description - Brief details of what occurred
 * @param {object} req - Express Request object to extract IP address
 */
export const logActivity = async (adminId, action, module, description, req = null) => {
  try {
    let ipAddress = null;
    if (req) {
      ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      // Truncate IPv6 local loops to simple format
      if (ipAddress === "::1") {
        ipAddress = "127.0.0.1";
      }
    }
    
    await prisma.activityLog.create({
      data: {
        adminId,
        action,
        module,
        description,
        ipAddress,
      },
    });
  } catch (err) {
    console.error("Activity Logging failed:", err.message);
  }
};
