import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const messages = body.messages || [];
  const lastMessage = messages[messages.length - 1]?.content || "";
  return {
    reply: `✅ تم استلام سؤالك: "${lastMessage}". سنرد قريبًا.`,
  };
});
