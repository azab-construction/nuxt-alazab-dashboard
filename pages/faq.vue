<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <div class="mx-auto max-w-3xl rounded bg-white px-6 py-10 shadow space-y-6">
    <h1 class="text-2xl text-yellow-600 font-bold">❓ الأسئلة الشائعة</h1>

    <div class="space-y-4">
      <div>
        <h3 class="text-gray-800 font-semibold">ما هو تطبيق Azab؟</h3>
        <p class="text-gray-600">
          هو نظام متكامل لإدارة طلبات الصيانة المعمارية في الفروع التجارية، من
          البلاغ إلى الفاتورة.
        </p>
      </div>
      <div>
        <h3 class="text-gray-800 font-semibold">
          هل يدعم التطبيق رفع صور مع الطلب؟
        </h3>
        <p class="text-gray-600">
          نعم، يمكن رفع مرفقات وصور توضح المشكلة مباشرة من النموذج.
        </p>
      </div>
      <div>
        <h3 class="text-gray-800 font-semibold">
          كيف أتلقى إشعارات بالطلبات الجديدة؟
        </h3>
        <p class="text-gray-600">
          يتم إرسال إشعار تلقائي إلى الإدارة والفنيين فور تقديم الطلب.
        </p>
      </div>
      <div>
        <h3 class="text-gray-800 font-semibold">هل يمكن تصدير التقارير؟</h3>
        <p class="text-gray-600">
          نعم، يمكن تصدير الطلبات بصيغ Excel و PDF من لوحة التحكم.
        </p>
      </div>
    </div>

    <div class="mt-8">
      <UButton color="primary" @click="goBack"> ⬅️ رجوع </UButton>
    </div>
  </div>
</template>
