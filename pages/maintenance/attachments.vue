<script setup lang="ts">
import { useFetch } from "#imports";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.query.id;
const loading = ref(true);
const filterType = ref<"all" | "image">("all");

const { data } = await useFetch(`/api/request-attachments?id=${requestId}`);
const attachments = ref(data.value || []);
loading.value = false;

const filteredAttachments = computed(() => {
  if (filterType.value === "image") {
    return attachments.value.filter((f) => f.type?.startsWith("image/"));
  }
  return attachments.value;
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="mx-auto max-w-5xl rounded bg-white p-6 shadow space-y-6">
    <h1 class="text-2xl text-blue-600 font-bold">📎 المرفقات</h1>

    <!-- فلترة حسب النوع -->
    <div class="mb-4 flex gap-4">
      <UButton
        :variant="filterType === 'all' ? 'solid' : 'outline'"
        @click="filterType = 'all'"
      >
        📂 الكل
      </UButton>
      <UButton
        :variant="filterType === 'image' ? 'solid' : 'outline'"
        @click="filterType = 'image'"
      >
        🖼 الصور فقط
      </UButton>
    </div>

    <!-- تحميل -->
    <div v-if="loading" class="text-gray-500">⏳ جاري تحميل المرفقات...</div>

    <!-- المرفقات -->
    <div
      v-else-if="filteredAttachments.length > 0"
      class="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2"
    >
      <div
        v-for="(file, index) in filteredAttachments"
        :key="index"
        class="overflow-hidden border rounded shadow transition hover:shadow-md"
      >
        <!-- عرض الصورة -->
        <img
          v-if="file.type.startsWith('image/')"
          :src="file.url"
          class="h-48 w-full object-cover"
          alt="صورة مرفقة"
        />

        <!-- عرض الملف غير الصوري -->
        <div v-else class="p-4 text-gray-700">
          <p class="font-semibold">
            {{ file.name }}
          </p>
          <p class="text-sm text-gray-500">
            {{ file.type }}
          </p>
        </div>

        <!-- معلومات -->
        <div class="border-t bg-gray-50 p-2 text-xs text-gray-500">
          <p>📅 {{ formatDate(file.created_at) }}</p>
          <a
            :href="file.url"
            target="_blank"
            class="mt-1 block text-sm text-blue-600 hover:underline"
          >
            🔗 فتح / تحميل
          </a>
        </div>
      </div>
    </div>

    <!-- لا توجد مرفقات -->
    <div v-else class="text-gray-500">لا توجد مرفقات لعرضها.</div>
  </div>
</template>
