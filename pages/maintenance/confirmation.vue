<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
    <h1 class="text-2xl font-bold text-green-600">✅ تأكيد استلام الخدمة</h1>

    <div v-if="request">
      <!-- بيانات الطلب -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        <div><strong>عنوان الطلب:</strong> {{ request.title }}</div>
        <div><strong>المتجر:</strong> {{ request.store_name }}</div>
        <div><strong>الخدمة:</strong> {{ request.service_name }}</div>
        <div>
          <strong>تاريخ التنفيذ:</strong>
          {{ formatDate(request.completion_date) }}
        </div>
      </div>

      <!-- التوقيع -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold mb-2">✍️ التوقيع الإلكتروني</h2>
        <canvas
          ref="canvasRef"
          class="border w-full h-48 bg-gray-50 rounded"
        ></canvas>
        <div class="flex gap-4 mt-2">
          <UButton color="gray" @click="clearSignature">مسح التوقيع</UButton>
        </div>
      </div>

      <!-- زر التأكيد -->
      <div class="mt-6">
        <UButton :loading="loading" color="primary" @click="submitConfirmation">
          حفظ التأكيد
        </UButton>
      </div>
    </div>

    <div v-else class="text-gray-500">جاري تحميل بيانات الطلب...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSupabaseClient, useSupabaseUser, useToast } from "#imports";

const route = useRoute();
const requestId = route.query.id;
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let drawing = false;

const request = ref<any>(null);
const loading = ref(false);

onMounted(async () => {
  const { data } = await supabase
    .from("maintenance_requests")
    .select(
      `
      id, title, store_id, primary_service_id,
      completion_date,
      stores (name),
      maintenance_services (name)
    `,
    )
    .eq("id", requestId)
    .single();

  if (data) {
    request.value = {
      ...data,
      store_name: data.stores?.name,
      service_name: data.maintenance_services?.name,
    };
  }

  // إعداد canvas
  const canvas = canvasRef.value;
  if (canvas) {
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", () => (drawing = true));
    canvas.addEventListener("mouseup", () => (drawing = false));
    canvas.addEventListener("mousemove", draw);
  }
});

function draw(e: MouseEvent) {
  if (!drawing || !ctx || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#1f2937"; // gray-800
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearSignature() {
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.beginPath();
  }
}

async function submitConfirmation() {
  if (!canvasRef.value || !user.value?.id) return;
  loading.value = true;

  const signatureData = canvasRef.value.toDataURL();

  const { error } = await supabase.from("request_status_log").insert({
    request_id: requestId,
    status: "completed",
    changed_by: user.value.id,
    note: "تم تأكيد استلام الخدمة",
    changed_at: new Date().toISOString(),
  });

  const { error: fileError } = await supabase.storage
    .from("signatures")
    .upload(`${requestId}/signature.png`, dataURLtoBlob(signatureData), {
      contentType: "image/png",
    });

  if (error || fileError) {
    toast.add({ title: "حدث خطأ أثناء الحفظ", color: "red" });
  } else {
    toast.add({ title: "تم تأكيد الاستلام بنجاح", color: "green" });
  }

  loading.value = false;
}

function dataURLtoBlob(dataURL: string) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
</script>
