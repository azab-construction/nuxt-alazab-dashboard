<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({ comments: Array, requestId: String });
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const newComment = ref("");
async function addComment() {
  if (!newComment.value) return;
  await supabase.from("comments").insert({
    request_id: props.requestId,
    user_id: user.value?.id,
    content: newComment.value,
  });
  newComment.value = "";
  location.reload();
}
</script>

<template>
  <div>
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="mb-4 border rounded p-2"
    >
      <p class="text-sm text-gray-600">
        {{ comment.profiles?.name }}
      </p>
      <p>{{ comment.content }}</p>
    </div>
    <UTextarea v-model="newComment" placeholder="أضف تعليقًا..." />
    <UButton class="mt-2" @click="addComment"> إرسال </UButton>
  </div>
</template>
