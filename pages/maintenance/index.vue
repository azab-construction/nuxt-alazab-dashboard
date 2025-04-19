<script setup lang="ts">
import { useFetch } from "#imports";
import html2pdf from "html2pdf.js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as XLSX from "xlsx";

const route = useRoute();
const _router = useRouter();
const search = ref("");
const loading = ref(true);
const requests = ref([]);
const pdfRef = ref(null);

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
  const sheetData = filteredRequests.value.map((item) => ({
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

function exportToPDF() {
  html2pdf()
    .from(pdfRef.value)
    .set({
      margin: 0.5,
      filename: "طلبات_الصيانة.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", format: "a4" },
    })
    .save();
}
</script>
