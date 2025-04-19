<!-- components/LanguageSwitcher.vue -->
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
function toggleLanguage() {
  locale.value = locale.value === "ar" ? "en" : "ar";
}
</script>

<template>
  <Button
    variant="outline"
    class="w-full justify-center"
    @click="toggleLanguage"
  >
    <Icon name="i-ph-translate-duotone" size="16" />
    <span class="text-xs">
      {{ locale === "ar" ? "English" : "العربية" }}
    </span>
  </Button>
</template>
