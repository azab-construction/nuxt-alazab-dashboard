<script setup lang="ts">
const state = reactive({
  showLogo: false,
  displayText: "",
  fullText:
    "We are committed to keeping your facility in top condition. www.azab.services",
});

onMounted(() => {
  state.showLogo = true;

  let index = 0;
  const interval = setInterval(() => {
    if (index < state.fullText.length) {
      state.displayText += state.fullText[index++];
    } else {
      clearInterval(interval);
    }
  }, 50);

  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 5000);
});
</script>

<template>
  <div>
    <img v-show="state.showLogo" src="..." alt="Logo" />
    <p>{{ state.displayText }}</p>
  </div>
</template>
