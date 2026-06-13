import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || "mgocsmdioceseofthumpamon@gmail.com";

/**
 * Sends a prayer request email directly to the diocese inbox.
 * @param {object} details - Request details
 * @param {string} details.name - Name
 * @param {string} details.email - Email
 * @param {string} details.phoneNumber - Phone Number
 * @param {string} details.message - Intention Message
 * @param {string} details.timestamp - Format date and time
 */
export const sendPrayerEmail = async ({ name, email, phoneNumber, message, timestamp }) => {
  // If email configuration is missing, print to console as fallback
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("\n[Email Alert] EMAIL_USER and EMAIL_PASS are not configured in server/.env!");
    console.log("==========================================");
    console.log("Subject: New Prayer Request Submission");
    console.log("------------------------------------------");
    console.log(`* Name: ${name}`);
    console.log(`* Email: ${email || "Not provided"}`);
    console.log(`* Phone Number: ${phoneNumber || "Not provided"}`);
    console.log(`* Prayer Request Message: ${message}`);
    console.log(`* Date & Time of Submission: ${timestamp}`);
    console.log("==========================================");
    return { success: false, fallback: true };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // SSL for port 465, TLS for port 587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name} (Prayer Request)" <${EMAIL_USER}>`,
    replyTo: email || undefined,
    to: EMAIL_TO,
    subject: "New Prayer Request Submission",
    text: `New Prayer Request Submission\n\n` +
          `* Name: ${name}\n` +
          `* Email: ${email || "Not provided"}\n` +
          `* Phone Number: ${phoneNumber || "Not provided"}\n` +
          `* Prayer Request Message: ${message}\n` +
          `* Date & Time of Submission: ${timestamp}\n\n` +
          `-------------------------------------------\n` +
          `Sent automatically from MGOCSM Diocese Server.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Server] Email sent successfully to ${EMAIL_TO}`);
  return { success: true };
};
