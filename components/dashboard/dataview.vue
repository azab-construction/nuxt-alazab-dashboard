<script setup lang="ts">
import { useSupabaseClient } from "#imports";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";
import PieChart from "@/components/PieChart.vue";
import StatCard from "@/components/StatCard.vue";
import { Card } from "@/components/ui/card";
import { onMounted, ref } from "vue";

const supabase = useSupabaseClient();

const stats = ref({
  total: 0,
  completed: 0,
  inProgress: 0,
  pending: 0,
  avgDuration: 0,
  avgEstimate: 0,
});

const statusDistribution = ref([]);
const storeDistribution = ref([]);
const monthlyData = ref([]);

onMounted(async () => {
  const { data: requests } = await supabase
    .from("maintenance_requests")
    .select("*")
    .eq("is_deleted", false);

  if (!requests) return;

  stats.value.total = requests.length;
  stats.value.completed = requests.filter(
    (r) => r.status === "completed",
  ).length;
  stats.value.inProgress = requests.filter(
    (r) => r.status === "inProgress",
  ).length;
  stats.value.pending = requests.filter((r) =>
    ["pending", "rejected"].includes(r.status),
  ).length;

  // توزيع الحالات
  const groupedStatus = groupBy(requests, "status");
  statusDistribution.value = Object.entries(groupedStatus).map(
    ([status, group]) => ({
      name: translateStatus(status),
      value: group.length,
    }),
  );

  // توزيع الفروع
  const groupedStores = groupBy(requests, "store_id");
  storeDistribution.value = Object.entries(groupedStores).map(
    ([store, group]) => ({
      name: store,
      value: group.length,
    }),
  );

  // الطلبات الشهرية
  const monthly = Array.from({ length: 12 }).fill(0);
  requests.forEach((r) => {
    const month = new Date(r.created_at).getMonth();
    monthly[month]++;
  });
  monthlyData.value = monthly.map((value, index) => ({
    name: getMonthName(index),
    value,
  }));

  // متوسطات الزمن
  const durations = requests
    .filter((r) => r.created_at && r.completion_date)
    .map((r) => {
      const start = new Date(r.created_at);
      const end = new Date(r.completion_date);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    });

  const estimates = requests.map((r) => r.estimated_time).filter(Number);

  stats.value.avgDuration = average(durations);
  stats.value.avgEstimate = average(estimates);
});

function groupBy(arr: any[], key: string) {
  return arr.reduce(
    (acc, obj) => {
      const k = obj[key] || "غير محدد";
      acc[k] = acc[k] || [];
      acc[k].push(obj);
      return acc;
    },
    {} as Record<string, any[]>,
  );
}

function average(arr: number[]) {
  return arr.length
    ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
    : 0;
}

function translateStatus(status: string) {
  const map: Record<string, string> = {
    pending: "قيد الانتظار",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    rejected: "مرفوض",
    closed: "مغلق",
    approved: "معتمد",
  };
  return map[status] || status;
}

function getMonthName(index: number) {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  return months[index];
}
</script>

<template>
  <div class="mx-auto max-w-7xl p-6 space-y-8">
    <!-- عنوان -->
    <h1 class="text-3xl text-blue-700 font-bold">📊 لوحة التحكم</h1>

    <!-- القسم الأول: كروت الإحصائيات الرئيسية -->
    <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
      <StatCard
        title="إجمالي الطلبات"
        :value="stats.total"
        icon="📋"
        color="blue"
      />
      <StatCard
        title="طلبات مكتملة"
        :value="stats.completed"
        icon="✅"
        color="green"
      />
      <StatCard
        title="طلبات قيد التنفيذ"
        :value="stats.inProgress"
        icon="🔧"
        color="yellow"
      />
      <StatCard
        title="مرفوضة / معلقة"
        :value="stats.pending"
        icon="🚫"
        color="red"
      />
    </div>

    <!-- القسم الثاني: توزيع الحالات -->
    <Card>
      <h2 class="mb-4 text-xl font-semibold">توزيع الطلبات حسب الحالة</h2>
      <PieChart :data="statusDistribution" />
    </Card>

    <!-- القسم الثالث: الطلبات حسب الفروع -->
    <Card>
      <h2 class="mb-4 text-xl font-semibold">عدد الطلبات لكل فرع</h2>
      <BarChart :data="storeDistribution" />
    </Card>

    <!-- القسم الرابع: الطلبات على مدار الزمن -->
    <Card>
      <h2 class="mb-4 text-xl font-semibold">الطلبات حسب الأشهر</h2>
      <LineChart :data="monthlyData" />
    </Card>

    <!-- القسم الخامس: زمن الإنجاز -->
    <Card>
      <h2 class="mb-4 text-xl font-semibold">متوسط زمن الإنجاز</h2>
      <p class="text-lg text-gray-700">🕓 {{ stats.avgDuration }} ساعة فعلية</p>
      <p class="text-sm text-gray-500">
        📐 الزمن التقديري: {{ stats.avgEstimate }} ساعة
      </p>
    </Card>
  </div>
</template>
----------------------------------------------------------------------------------------------------------------------------------
🧱 HTML داخل dashboard.vue

<!-- زر التصدير -->
<div class="flex justify-end gap-4">
  <UButton color="gray" @click="exportDashboardToExcel">📥 تحميل Excel</UButton>
  <UButton color="gray" @click="exportDashboardToPDF">📄 تحميل PDF</UButton>
</div>

<!-- المحتوى القابل للتصدير كـ PDF -->
<div ref="pdfRef" class="bg-white p-4 border mt-6 rounded">
  <h2 class="text-lg font-bold mb-4">📊 ملخص لوحة التحكم</h2>
  <ul class="space-y-2 text-sm text-gray-700">
    <li>📋 إجمالي الطلبات: {{ stats.total }}</li>
    <li>✅ مكتملة: {{ stats.completed }}</li>
    <li>🔧 قيد التنفيذ: {{ stats.inProgress }}</li>
    <li>🚫 معلّقة / مرفوضة: {{ stats.pending }}</li>
    <li>🕓 متوسط الزمن الفعلي: {{ stats.avgDuration }} ساعة</li>
    <li>📐 الزمن التقديري: {{ stats.avgEstimate }} ساعة</li>
  </ul>
</div>

// File: /server/api/send-dashboard-email.ts import { sendEmail } from
'~/utils/email' import { defineEventHandler, readBody } from 'h3' export default
defineEventHandler(async (event) => { const body = await readBody(event) const {
to, fileUrl } = body if (!to || !fileUrl) { return createError({ statusCode:
400, message: 'Missing to or fileUrl' }) } const subject = '📊 تقرير لوحة التحكم
- Azab Maintenance' const message = `مرحبًا،\n\nتم إرفاق تقرير لوحة التحكم
الخاصة بالصيانة.\n\n📎 تحميل التقرير: ${fileUrl}\n\nمع تحيات فريق Azab.` const
result = await sendEmail({ to, subject, text: message }) return result })
