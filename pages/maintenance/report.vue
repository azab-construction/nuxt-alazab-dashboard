<script setup lang="ts">
import { useFetch } from "#imports";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.query.id;
const loading = ref(true);

const { data } = await useFetch(`/api/request-report?id=${requestId}`);
const report = ref(data.value || null);
loading.value = false;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded bg-white p-6 shadow space-y-6">
    <h1 class="text-2xl text-blue-600 font-bold">🧾 التقرير الفني للطلب</h1>

    <div v-if="loading" class="text-gray-500">⏳ جاري تحميل التقرير...</div>

    <div v-else-if="report">
      <!-- ملخص التقرير -->
      <div class="border-l-4 border-blue-400 rounded bg-blue-50 py-2 pl-4">
        <p class="whitespace-pre-line text-gray-800 leading-relaxed">
          {{ report.details }}
        </p>
      </div>

      <!-- معلومات إضافية -->
      <div
        class="grid grid-cols-1 mt-6 gap-4 text-sm text-gray-700 md:grid-cols-2"
      >
        <div><strong>الفني المنفذ:</strong> {{ report.technician_name }}</div>
        <div>
          <strong>تاريخ التقرير:</strong> {{ formatDate(report.created_at) }}
        </div>
        <div v-if="report.actual_cost">
          <strong>التكلفة الفعلية:</strong> {{ report.actual_cost }} ريال
        </div>
        <div v-if="report.recommendations">
          <strong>توصيات:</strong> {{ report.recommendations }}
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">
      لا يوجد تقرير فني مسجل لهذا الطلب حتى الآن.
    </div>
  </div>
</template>
