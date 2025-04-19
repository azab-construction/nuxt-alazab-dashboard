<script setup lang="ts">
import { useFetch } from "#imports";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.query.id;

const { data } = await useFetch(`/api/request-details?id=${requestId}`);
const request = data.value || {};

const eta = computed(() => {
  if (!request.scheduled_date || !request.estimated_time) return null;

  const start = new Date(request.scheduled_date);
  const etaDate = new Date(
    start.getTime() + request.estimated_time * 60 * 60 * 1000,
  );
  return etaDate.toISOString();
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
  <div class="mx-auto max-w-3xl rounded bg-white p-6 shadow space-y-6">
    <h1 class="text-2xl text-blue-600 font-bold">
      ⏱️ الموعد المتوقع لإنهاء الطلب (ETA)
    </h1>

    <div v-if="eta">
      <p class="text-lg text-gray-700">
        🗓️ <strong>من المتوقع إنهاء العمل في:</strong> {{ formatDate(eta) }}
      </p>
      <p class="mt-2 text-sm text-gray-500">
        محسوب من تاريخ التنفيذ المطلوب ({{
          formatDate(request.scheduled_date)
        }}) + مدة الخدمة التقديرية ({{ request.estimated_time }} ساعة)
      </p>
    </div>

    <div v-else class="text-gray-500">
      لا توجد بيانات كافية لحساب الموعد المتوقع.
    </div>
  </div>
</template>
