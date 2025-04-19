<!-- pages/stores/[id].vue -->
<script setup>
const route = useRoute();
const storeId = Number.parseInt(route.params.id);

// محاكاة جلب بيانات الفرع من API
const store = ref({
  id: storeId,
  name: `فرع رقم ${storeId}`,
  image: `/images/stores/store${storeId}.jpg`,
  address: "شارع عباس العقاد، مدينة نصر، القاهرة",
  phone: "0123456789",
  manager: "أحمد محمد",
  email: "store@example.com",
  openingHours: "من 10 صباحاً إلى 10 مساءً",
  employees: 15,
  area: 250,
  maintenanceRequests: [
    { id: 101, title: "صيانة تكييف", status: "مكتمل", date: "2023-05-15" },
    {
      id: 102,
      title: "إصلاح إضاءة",
      status: "قيد التنفيذ",
      date: "2023-06-20",
    },
  ],
  gallery: [
    "/images/stores/store1-1.jpg",
    "/images/stores/store1-2.jpg",
    "/images/stores/store1-3.jpg",
  ],
});
</script>

<template>
  <div>
    <UPageHeader :title="store.name">
      <template #right>
        <UButton color="primary" icon="i-lucide-edit"> تعديل </UButton>
        <UButton color="danger" icon="i-lucide-trash" class="mr-2">
          حذف
        </UButton>
      </template>
      <template #description>
        <UBreadcrumb
          :items="[
            { label: 'الرئيسية', to: '/' },
            { label: 'الفروع', to: '/stores' },
            { label: store.name, to: `/stores/${store.id}` },
          ]"
        />
      </template>
    </UPageHeader>

    <div class="grid grid-cols-1 mt-6 gap-6 md:grid-cols-3">
      <!-- معلومات الفرع الأساسية -->
      <UCard class="md:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">معلومات الفرع</h3>
            <UIcon name="i-lucide-info" />
          </div>
        </template>

        <div class="space-y-4">
          <img
            :src="store.image"
            :alt="store.name"
            class="h-64 w-full rounded-lg object-cover"
          />

          <div class="grid grid-cols-1 mt-4 gap-4 md:grid-cols-2">
            <div class="flex items-center">
              <UIcon name="i-lucide-map-pin" class="mr-2 text-primary" />
              <span>{{ store.address }}</span>
            </div>

            <div class="flex items-center">
              <UIcon name="i-lucide-phone" class="mr-2 text-primary" />
              <span>{{ store.phone }}</span>
            </div>

            <div class="flex items-center">
              <UIcon name="i-lucide-mail" class="mr-2 text-primary" />
              <span>{{ store.email }}</span>
            </div>

            <div class="flex items-center">
              <UIcon name="i-lucide-clock" class="mr-2 text-primary" />
              <span>{{ store.openingHours }}</span>
            </div>

            <div class="flex items-center">
              <UIcon name="i-lucide-users" class="mr-2 text-primary" />
              <span>عدد الموظفين: {{ store.employees }}</span>
            </div>

            <div class="flex items-center">
              <UIcon name="i-lucide-square" class="mr-2 text-primary" />
              <span>المساحة: {{ store.area }} متر مربع</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- معلومات المدير -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">مدير الفرع</h3>
            <UIcon name="i-lucide-user" />
          </div>
        </template>

        <div class="flex flex-col items-center">
          <UAvatar size="xl" src="/images/avatar.jpg" alt="صورة المدير" />
          <h4 class="mt-4 text-lg font-semibold">
            {{ store.manager }}
          </h4>
          <p class="text-sm text-gray-500">مدير فرع</p>
          <div class="mt-4 flex space-x-2">
            <UButton color="primary" variant="ghost" icon="i-lucide-phone" />
            <UButton color="primary" variant="ghost" icon="i-lucide-mail" />
            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-message-square"
            />
          </div>
        </div>
      </UCard>

      <!-- طلبات الصيانة -->
      <UCard class="md:col-span-3">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">طلبات الصيانة الأخيرة</h3>
            <UButton to="/maintenance/new" color="primary" size="sm">
              طلب صيانة جديد
            </UButton>
          </div>
        </template>

        <UTable
          :columns="[
            { key: 'id', label: 'رقم الطلب' },
            { key: 'title', label: 'عنوان الطلب' },
            { key: 'status', label: 'الحالة' },
            { key: 'date', label: 'التاريخ' },
            { key: 'actions', label: 'الإجراءات' },
          ]"
          :rows="store.maintenanceRequests"
        >
          <template #status-cell="{ row }">
            <UBadge :color="row.status === 'مكتمل' ? 'success' : 'warning'">
              {{ row.status }}
            </UBadge>
          </template>
          <template #actions-cell>
            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-eye"
              size="xs"
            />
          </template>
        </UTable>
      </UCard>

      <!-- معرض الصور -->
      <UCard class="md:col-span-3">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">معرض الصور</h3>
            <UButton color="primary" size="sm" icon="i-lucide-plus">
              إضافة صور
            </UButton>
          </div>
        </template>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
          <div
            v-for="(image, index) in store.gallery"
            :key="index"
            class="relative"
          >
            <img :src="image" class="h-48 w-full rounded-lg object-cover" />
            <div class="absolute right-2 top-2">
              <UButton
                color="danger"
                variant="solid"
                icon="i-lucide-trash"
                size="xs"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
