import { defineNuxtPlugin } from "#app";
import { useSupabaseUser } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const user = useSupabaseUser();
  nuxtApp.provide("user", user);
});
