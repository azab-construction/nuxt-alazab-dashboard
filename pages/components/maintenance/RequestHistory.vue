<script setup lang="ts">
const _props = defineProps<{
  history: Array<any>;
}>();
const columns = [
  { key: "action", label: "الإجراء" },
  { key: "details", label: "التفاصيل" },
  { key: "timestamp", label: "الوقت" },
];
</script>

<template>
  <UTable :rows="history" :columns="columns" />
</template>
