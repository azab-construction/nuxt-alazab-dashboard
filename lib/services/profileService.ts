import { supabase } from "~/lib/supabase";

export async function getProfile(userId: string) {
  return await supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(userId: string, data: any) {
  return await supabase.from("profiles").update(data).eq("id", userId);
}
