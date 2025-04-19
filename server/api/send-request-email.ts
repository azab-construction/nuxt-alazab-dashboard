import { defineEventHandler, readBody } from "h3";
import { sendEmail } from "~/utils/email";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const toList = Array.isArray(body.to) ? body.to : [body.to];

  const message = `
🛠️ طلب صيانة جديد

📋 العنوان: ${body.title}
🏪 المتجر: ${body.store_name}
📆 التاريخ المطلوب: ${body.scheduled_date}
⚠️ الأولوية: ${body.priority}
📝 الوصف: ${body.description}

🔗 رابط الطلب: https://your-app.com/maintenance/requests/${body.id}
`;

  const result = await sendEmail({
    to: toList.join(","),
    subject: "📩 طلب صيانة جديد",
    text: message,
  });

  return result;
});
