<script setup lang="ts">
import { useFetch } from "#imports";
import SendWelcomeButton from "@/components/SendWelcomeButton.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const requestId = route.params.id || route.query.id;

const { data } = await useFetch(`/api/request-details?id=${requestId}`);
const request = data.value || null;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
    <h1 class="mb-6 text-2xl text-blue-600 font-bold">📋 تفاصيل طلب الصيانة</h1>

    <div v-if="request" class="space-y-6">
      <!-- القسم: البيانات العامة -->
      <section>
        <h2 class="mb-2 text-xl text-gray-700 font-semibold">
          📌 البيانات العامة
        </h2>
        <div class="grid grid-cols-1 gap-4 text-gray-800 md:grid-cols-2">
          <div><strong>عنوان الطلب:</strong> {{ request.title }}</div>
          <div><strong>المتجر:</strong> {{ request.store_name }}</div>
          <div>
            <strong>الخدمة المطلوبة:</strong> {{ request.service_name }}
          </div>
          <div><strong>الأولوية:</strong> {{ request.priority }}</div>
        </div>
      </section>

      <!-- القسم: الوصف -->
      <section>
        <h2 class="mb-2 text-xl text-gray-700 font-semibold">📝 وصف المشكلة</h2>
        <p class="whitespace-pre-wrap text-gray-700">
          {{ request.description }}
        </p>
      </section>

      <!-- القسم: الجدولة -->
      <section>
        <h2 class="mb-2 text-xl text-gray-700 font-semibold">⏱️ التوقيت</h2>
        <div class="grid grid-cols-1 gap-4 text-gray-800 md:grid-cols-2">
          <div>
            <strong>تاريخ الإنشاء:</strong> {{ formatDate(request.created_at) }}
          </div>
          <div>
            <strong>التاريخ المطلوب:</strong>
            {{ formatDate(request.scheduled_date) }}
          </div>
        </div>
      </section>

      <!-- القسم: الحالة -->
      <section>
        <h2 class="mb-2 text-xl text-gray-700 font-semibold">🔄 حالة الطلب</h2>
        <p class="text-gray-700">
          <strong>الحالة الحالية:</strong> {{ request.status }}
        </p>
      </section>

      <!-- القسم: تفاصيل إضافية -->
      <section v-if="request.estimated_cost || request.estimated_time">
        <h2 class="mb-2 text-xl text-gray-700 font-semibold">📈 تقديرات</h2>
        <div class="grid grid-cols-1 gap-4 text-gray-800 md:grid-cols-2">
          <div v-if="request.estimated_cost">
            <strong>التكلفة التقديرية:</strong>
            {{ request.estimated_cost }} ريال
          </div>
          <div v-if="request.estimated_time">
            <strong>المدة التقديرية:</strong> {{ request.estimated_time }} ساعة
          </div>
          <div v-if="request.additional_info">
            <strong>معلومات إضافية:</strong> {{ request.additional_info }}
          </div>
        </div>
      </section>

      <!-- زر إرسال بريد ترحيبي -->
      <SendWelcomeButton
        :email="request.email"
        :username="request.name"
        :request-id="request.id"
        :request-status="request.status"
      />
    </div>

    <div v-else class="mt-10 text-center text-gray-500">
      جاري تحميل تفاصيل الطلب...
    </div>
  </div>
</template>
