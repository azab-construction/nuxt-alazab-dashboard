<script setup lang="ts">
import { useAsyncData, useRoute, useSupabaseClient } from "#imports";
import RequestCard from "~/components/maintenance/RequestCard.vue";
import RequestComment from "~/components/maintenance/RequestComment.vue";
import RequestHistory from "~/components/maintenance/RequestHistory.vue";
import RequestImages from "~/components/maintenance/RequestImages.vue";
import RequestStepper from "~/components/maintenance/RequestStepper.vue";

const route = useRoute();
const requestId = route.params.id;
const supabase = useSupabaseClient();
const { data: request } = await useAsyncData("request", async () => {
  const { data } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("id", requestId)
    .single();
  return data;
});
const { data: workflowSteps } = await useAsyncData("workflow", async () => {
  const { data } = await supabase
    .from("workflow_steps")
    .select("*")
    .eq("request_id", requestId);
  return data;
});
const { data: images } = await useAsyncData("images", async () => {
  const { data } = await supabase
    .from("images")
    .select("*")
    .eq("request_id", requestId);
  return data;
});
const { data: comments } = await useAsyncData("comments", async () => {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("request_id", requestId);
  return data;
});
const { data: history } = await useAsyncData("history", async () => {
  const { data } = await supabase
    .from("history")
    .select("*")
    .eq("request_id", requestId);
  return data;
});
</script>

<template>
  <div>
    <RequestCard :request="request" />
    <RequestStepper :steps="workflowSteps" />
    <RequestImages :images="images" />
    <RequestComment :comments="comments" :request-id="requestId" />
    <RequestHistory :history="history" />
  </div>
</template>
