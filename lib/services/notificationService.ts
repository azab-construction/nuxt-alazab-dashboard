import { supabase } from "~/lib/supabase";

export async function fetchNotifications(userId: string) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function markAsRead(notificationId: string) {
  return await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}
