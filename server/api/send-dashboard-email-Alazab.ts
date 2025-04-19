import type { H3Event } from "h3";
import { createServerSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  const client = createServerSupabaseClient(event);
  const user = await client.auth.getUser();

  const requestId = getQuery(event).id as string;
  if (!requestId) {
    return createError({ statusCode: 400, message: "معرّف الطلب مفقود" });
  }

  const { data, error } = await client
    .from("maintenance_requests")
    .select(
      `
      id,
      title,
      description,
      status,
      priority,
      scheduled_date,
      estimated_cost,
      actual_cost,
      completion_date,
      created_at,
      updated_at,
      store_id,
      primary_service_id,
      created_by,
      assigned_to,

      stores:store_id (name),
      services:primary_service_id (name, estimated_time),
      creator:created_by (name),
      assignee:assigned_to (name)
    `,
    )
    .eq("id", requestId)
    .single();

  if (error) {
    return createError({ statusCode: 404, message: "لم يتم العثور على الطلب" });
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    scheduled_date: data.scheduled_date,
    estimated_cost: data.estimated_cost,
    actual_cost: data.actual_cost,
    completion_date: data.completion_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    store_name: data.stores?.name,
    service_name: data.services?.name,
    estimated_time: data.services?.estimated_time,
    created_by: data.creator?.name,
    assigned_to: data.assignee?.name,
  };
});
