<script setup lang="ts">
const _props = defineProps<{
  // تعريف Props
}>();

function statusColor(status: string) {
  return status === "completed"
    ? "green"
    : status === "in-progress"
      ? "blue"
      : "yellow";
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">طلب رقم: {{ request.id }}</h2>
        <UBadge :color="statusColor(request.status)">
          {{ request.status }}
        </UBadge>
      </div>
    </template>
    <p><strong>العنوان:</strong> {{ request.title }}</p>
    <p><strong>الوصف:</strong> {{ request.description }}</p>
    <p><strong>الأولوية:</strong> {{ request.priority }}</p>
  </UCard>
</template>
