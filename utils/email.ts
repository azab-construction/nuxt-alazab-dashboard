import nodemailer from "nodemailer";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Azab App" <${config.MAIL_USER}>`,
      to,
      subject,
      text,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
