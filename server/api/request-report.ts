import type { H3Event } from "h3";
import { createServerSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  const client = createServerSupabaseClient(event);
  const requestId = getQuery(event).id as string;

  if (!requestId) {
    return createError({ statusCode: 400, message: "رقم الطلب غير موجود" });
  }

  const { data, error } = await client
    .from("history")
    .select(
      `
      id,
      details,
      actual_cost,
      recommendations,
      created_at,
      user_id,
      profiles:user_id (name)
    `,
    )
    .eq("request_id", requestId)
    .eq("action", "تقرير فني")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    details: data.details,
    actual_cost: data.actual_cost,
    recommendations: data.recommendations,
    created_at: data.created_at,
    technician_name: data.profiles?.name || "—",
  };
});
