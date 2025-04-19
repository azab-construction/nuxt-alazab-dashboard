<script setup>
defineProps({ open: Boolean });
const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="relative max-w-lg w-full rounded-lg bg-white p-6">
      <button
        class="absolute right-2 top-2 text-xl text-gray-400 hover:text-black"
        @click="close"
      >
        ×
      </button>
      <slot />
    </div>
  </div>
</template>
