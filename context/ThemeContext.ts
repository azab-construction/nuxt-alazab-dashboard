import { defineNuxtPlugin } from "#app";
import { ref } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  const theme = ref<"light" | "dark">("light");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme.value === "dark");
  };

  nuxtApp.provide("theme", {
    theme,
    toggleTheme,
  });
});
