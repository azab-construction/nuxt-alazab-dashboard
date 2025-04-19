import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useRole } from "~/hooks/useRole";

export default defineNuxtRouteMiddleware(() => {
  const role = useRole();
  if (role.value !== "customer") return navigateTo("/auth/login");
});
