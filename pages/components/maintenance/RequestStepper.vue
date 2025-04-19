<script setup lang="ts">
const props = defineProps({
  steps: Array,
});
const activeStep = computed(() =>
  props.steps.findIndex((step) => step.status !== "completed"),
);
</script>

<template>
  <UStepper :steps="steps" :active="activeStep" />
</template>
