import type { H3Event } from "h3";
import { createServerSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  const client = createServerSupabaseClient(event);
  const query = getQuery(event);

  const filters = {
    title: query.title as string | undefined,
    status: query.status as string | undefined,
    store_id: query.store_id as string | undefined,
    primary_service_id: query.primary_service_id as string | undefined,
    date_from: query.date_from as string | undefined,
    date_to: query.date_to as string | undefined,
  };

  let req = client
    .from("maintenance_requests")
    .select(
      `
      id,
      title,
      status,
      created_at,
      store_id,
      primary_service_id,
      stores (name),
      maintenance_services (name)
    `,
    )
    .eq("is_deleted", false);

  if (filters.title) {
    req = req.ilike("title", `%${filters.title}%`);
  }

  if (filters.status) {
    req = req.eq("status", filters.status);
  }

  if (filters.store_id) {
    req = req.eq("store_id", filters.store_id);
  }

  if (filters.primary_service_id) {
    req = req.eq("primary_service_id", filters.primary_service_id);
  }

  if (filters.date_from) {
    req = req.gte("created_at", filters.date_from);
  }

  if (filters.date_to) {
    req = req.lte("created_at", filters.date_to);
  }

  const { data, error } = await req.order("created_at", { ascending: false });

  if (error) {
    return createError({ statusCode: 500, message: "فشل في جلب الطلبات" });
  }

  const result = data.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    created_at: item.created_at,
    store_name: item.stores?.name || "",
    service_name: item.maintenance_services?.name || "",
  }));

  return result;
});
