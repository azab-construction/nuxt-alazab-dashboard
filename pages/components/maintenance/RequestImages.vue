<script setup lang="ts">
const _props = defineProps<{
  images: Array;
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
    <NuxtImg
      v-for="img in images"
      :key="img.id"
      :src="img.url"
      class="rounded shadow"
      width="300"
    />
  </div>
</template>
