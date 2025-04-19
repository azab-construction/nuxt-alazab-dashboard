<script setup>
// بيانات الفروع (يمكن استبدالها بجلب البيانات من API)
const stores = ref([
  {
    id: 1,
    name: "فرع مدينة نصر",
    image: "/images/stores/store1.jpg",
    address: "شارع عباس العقاد، مدينة نصر، القاهرة",
    phone: "0123456789",
    manager: "أحمد محمد",
  },
  {
    id: 2,
    name: "فرع المعادي",
    image: "/images/stores/store2.jpg",
    address: "شارع 9، المعادي، القاهرة",
    phone: "0123456788",
    manager: "محمد علي",
  },
  {
    id: 3,
    name: "فرع الدقي",
    image: "/images/stores/store3.jpg",
    address: "شارع التحرير، الدقي، الجيزة",
    phone: "0123456787",
    manager: "سارة أحمد",
  },
]);
</script>

<template>
  <div>
    <UPageHeader
      title="إدارة الفروع"
      description="عرض وإدارة جميع فروع المحلات التجارية"
    >
      <template #right>
        <UButton color="primary" icon="i-lucide-plus"> إضافة فرع جديد </UButton>
      </template>
    </UPageHeader>

    <UPageGrid>
      <UPageCard
        v-for="store in stores"
        :key="store.id"
        :title="store.name"
        :description="store.address"
        :to="`/stores/${store.id}`"
        class="cursor-pointer"
      >
        <img
          :src="store.image"
          :alt="store.name"
          class="h-48 w-full rounded-t-lg object-cover"
        />

        <template #footer>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">المدير: {{ store.manager }}</p>
              <p class="text-sm text-gray-500">هاتف: {{ store.phone }}</p>
            </div>
            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-arrow-right"
            />
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
