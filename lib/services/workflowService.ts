import { supabase } from "~/lib/supabase";

export async function getWorkflow(requestId: string) {
  return await supabase
    .from("workflow_steps")
    .select("*")
    .eq("request_id", requestId)
    .order("step_order", { ascending: true });
}

export async function addStepToWorkflow(data: any) {
  return await supabase.from("workflow_steps").insert([data]);
}
