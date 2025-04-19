import { readBody } from "h3";
import nodemailer from "nodemailer";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const transporter = nodemailer.createTransport({
    host: config.public.SMTP_HOST,
    port: Number(config.public.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: config.public.SMTP_USER,
      pass: config.public.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Azab App <mohamed@al-azab.co>",
    to: "azab68320@gmail.com",
    subject: body.subject || "رسالة جديدة من مساعد Azab",
    html: `<pre style="white-space: pre-wrap">${body.content}</pre>`,
  });

  return { success: true };
});
