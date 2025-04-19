<script setup>
import { ref } from "vue";

const toasts = ref([]);

function toastColor(color) {
  return (
    {
      green: "border-green-500",
      red: "border-red-500",
      yellow: "border-yellow-500",
    }[color] || "border-gray-300"
  );
}

defineExpose({
  add(toast) {
    toasts.value.push(toast);
    setTimeout(() => toasts.value.shift(), 4000);
  },
});
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <transition-group name="toast" tag="div">
      <div
        v-for="(t, index) in toasts"
        :key="index"
        class="mb-2 w-80 border-l-4 rounded bg-white p-4 shadow"
        :class="toastColor(t.color)"
      >
        <p class="font-bold">
          {{ t.title }}
        </p>
        <p class="text-sm text-gray-500">
          {{ t.description }}
        </p>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
