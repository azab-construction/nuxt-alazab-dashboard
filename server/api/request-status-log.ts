import type { H3Event } from "h3";
import { createServerSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  const client = createServerSupabaseClient(event);
  const requestId = getQuery(event).id as string;

  if (!requestId) {
    return createError({ statusCode: 400, message: "معرّف الطلب مفقود" });
  }

  const { data, error } = await client
    .from("request_status_log")
    .select(
      `
      status,
      changed_at,
      note,
      changed_by,
      profiles:changed_by (name)
    `,
    )
    .eq("request_id", requestId)
    .order("changed_at", { ascending: true });

  if (error) {
    return createError({ statusCode: 500, message: "فشل في جلب سجل الحالة" });
  }

  const formatted = data.map((entry) => ({
    status: entry.status,
    changed_at: entry.changed_at,
    note: entry.note,
    changed_by_name: entry.profiles?.name || "—",
  }));

  return formatted;
});
