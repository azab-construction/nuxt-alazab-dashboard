<script setup lang="ts">
import { useFetch } from "#imports";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.query.id;
const loading = ref(true);

const { data } = await useFetch(`/api/request-status-log?id=${requestId}`);
const statusLog = data.value || [];
loading.value = false;

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

function statusColor(status: string) {
  const map = {
    pending: "border-yellow-400",
    inProgress: "border-blue-400",
    completed: "border-green-500",
    closed: "border-gray-400",
    rejected: "border-red-500",
  };
  return map[status] || "border-gray-300";
}

function translateStatus(status: string) {
  const map = {
    pending: "قيد الانتظار",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    closed: "مغلق",
    rejected: "مرفوض",
    approved: "معتمد",
    inReview: "قيد المراجعة",
    scheduled: "مجدول",
  };
  return map[status] || status;
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded bg-white p-6 shadow space-y-6">
    <h1 class="mb-4 text-2xl text-blue-600 font-bold">📊 حالة الطلب</h1>

    <!-- تحميل -->
    <div v-if="loading" class="text-gray-500">⏳ جاري تحميل سجل الحالة...</div>

    <!-- الجدول الزمني للحالات -->
    <div v-else-if="statusLog.length > 0" class="space-y-4">
      <div
        v-for="(entry, index) in statusLog"
        :key="index"
        class="border-l-4 py-2 pl-4"
        :class="statusColor(entry.status)"
      >
        <p class="text-gray-800 font-semibold">
          {{ translateStatus(entry.status) }} –
          <span class="text-sm text-gray-500">{{
            formatDate(entry.changed_at)
          }}</span>
        </p>
        <p class="text-sm text-gray-600">
          تم التغيير بواسطة: {{ entry.changed_by_name }}
        </p>
        <p v-if="entry.note" class="mt-1 text-sm text-gray-500">
          💬 {{ entry.note }}
        </p>
      </div>
    </div>

    <!-- في حال لا يوجد سجل -->
    <div v-else class="text-gray-500">
      لا يوجد أي تحديثات على حالة هذا الطلب حتى الآن.
    </div>
  </div>
</template>
