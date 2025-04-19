import { supabase } from "~/lib/supabase";

export async function getGalleryByStore(storeId: string) {
  return await supabase
    .from("store_facades_gallery")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
}

export async function uploadImage(path: string, file: File) {
  return await supabase.storage.from("gallery-server").upload(path, file);
}
