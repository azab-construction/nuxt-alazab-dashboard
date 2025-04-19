<script setup lang="ts">
import { useFetch } from "#imports";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as XLSX from "xlsx";

const route = useRoute();
const router = useRouter();
const search = ref("");
const filters = ref({
  title: "",
  status: "",
  store_id: "",
  primary_service_id: "",
  date_from: "",
  date_to: "",
});
const statusOptions = [
  "pending",
  "inReview",
  "approved",
  "rejected",
  "scheduled",
  "inProgress",
  "completed",
  "closed",
];
const loading = ref(true);
const requests = ref([]);
const _filteredRequests = ref([]);

const { data: storesData } = await useFetch("/api/stores");
const { data: servicesData } = await useFetch("/api/maintenance-services");
const stores = computed(() => storesData.value || []);
const services = computed(() => servicesData.value || []);

onMounted(async () => {
  const params = route.query;
  const { data } = await useFetch(`/api/maintenance-requests`, { params });
  requests.value = data.value || [];
  loading.value = false;
});

const filteredRequests = computed(() => {
  return requests.value.filter((item) =>
    item.title?.toLowerCase().includes(search.value.toLowerCase()),
  );
});

function applyFilters() {
  const params = new URLSearchParams();
  for (const key in filters.value) {
    const value = filters.value[key];
    if (value) params.append(key, value);
  }
  router.push(`/maintenance/requests?${params.toString()}`);
}

function translateStatus(status: string) {
  const map = {
    pending: "قيد الانتظار",
    inReview: "قيد المراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
    scheduled: "مجدول",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    closed: "مغلق",
  };
  return map[status] || status;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function exportToExcel() {
  const sheetData = requests.value.map((item) => ({
    "عنوان الطلب": item.title,
    المتجر: item.store_name,
    الحالة: translateStatus(item.status),
    "تاريخ الإنشاء": formatDate(item.created_at),
  }));
  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "طلبات الصيانة");
  XLSX.writeFile(workbook, "طلبات_الصيانة.xlsx");
}
</script>
