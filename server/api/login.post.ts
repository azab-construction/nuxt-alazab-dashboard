import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  // تحقق من بيانات المستخدم (يمكنك استبدال هذا بالتحقق من قاعدة البيانات)
  if (email === "admin@example.com" && password === "yourpassword") {
    // تعيين جلسة المستخدم في الكوكي
    await setUserSession(event, {
      user: {
        name: "مدير النظام",
        role: "admin",
      },
    });
    return {};
  }
  throw createError({
    statusCode: 401,
    message: "بيانات الاعتماد غير صحيحة",
  });
});
