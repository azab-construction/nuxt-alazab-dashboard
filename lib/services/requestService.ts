import { supabase } from "~/lib/supabase";

export async function fetchRequests() {
  return await supabase
    .from("maintenance_requests")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createRequest(data: any) {
  return await supabase
    .from("maintenance_requests")
    .insert([data])
    .select()
    .single();
}

export async function updateRequestStatus(id: string, status: string) {
  return await supabase
    .from("maintenance_requests")
    .update({ status })
    .eq("id", id);
}
