<script setup lang="ts">
import { useFetch } from "#imports";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.params.id || route.query.id;

const { data } = await useFetch(`/api/request-attachments?id=${requestId}`);
const attachments = data.value || [];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <div class="mx-auto mt-6 max-w-4xl rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-xl text-gray-700 font-bold">📎 المرفقات</h2>

    <div
      v-if="attachments.length"
      class="grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3"
    >
      <div
        v-for="(file, index) in attachments"
        :key="index"
        class="overflow-hidden border rounded-lg shadow-sm transition hover:shadow"
      >
        <img :src="file.file_url" alt="مرفق" class="h-40 w-full object-cover" />
        <div class="p-2 text-center text-xs text-gray-500">
          📅 {{ formatDate(file.uploaded_at) }}
        </div>
      </div>
    </div>

    <div v-else class="mt-4 text-center text-gray-500">
      لا توجد مرفقات لهذا الطلب.
    </div>
  </div>
</template>
