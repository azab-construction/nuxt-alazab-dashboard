import { supabase } from "~/lib/supabase";

export async function fetchInvoices() {
  return await supabase
    .from("invoices")
    .select("*")
    .order("issued_at", { ascending: false });
}

export async function createInvoice(data: any) {
  return await supabase.from("invoices").insert([data]);
}
