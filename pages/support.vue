<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <div class="mx-auto max-w-3xl rounded bg-white px-6 py-10 shadow">
    <h1 class="mb-4 text-2xl text-blue-700 font-bold">🛟 الدعم الفني</h1>
    <p class="mb-6 text-gray-600">
      إذا واجهت أي مشكلة أو لديك استفسار حول التطبيق، لا تتردد في التواصل مع
      فريق الدعم الفني عبر الطرق التالية:
    </p>
    <ul class="list-disc pl-5 text-gray-700 space-y-2">
      <li>
        📧 البريد الإلكتروني:
        <a href="mailto:support@al-azab.co" class="text-blue-600 underline"
          >support@al-azab.co</a
        >
      </li>
      <li>📞 الهاتف: 01092750351</li>
      <li>
        💬 الدعم عبر الواتساب:
        <a
          href="https://wa.me/201004006620"
          target="_blank"
          class="text-green-600 underline"
          >تواصل معنا</a
        >
      </li>
    </ul>
    <div class="mt-8">
      <UButton color="primary" @click="goBack"> ⬅️ رجوع </UButton>
    </div>
  </div>
</template>
