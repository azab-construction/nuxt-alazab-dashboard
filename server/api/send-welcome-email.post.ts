import fs from "node:fs";
import path from "node:path";
import { defineEventHandler, readBody } from "h3";
import { sendEmail } from "~/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const templatePath = path.resolve("server/email-templates/welcome.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  // استبدال المتغيرات
  template = template
    .replace("{{username}}", body.username)
    .replace("{{request_url}}", body.request_url || "#")
    .replace("{{request_status}}", body.request_status || "-")
    .replace("{{request_number}}", body.request_number || "-");

  const result = await sendEmail({
    to: body.email,
    subject: "👋 مرحبًا بك في Al-Azab Services",
    html: template,
  });

  return { success: true, result };
});
