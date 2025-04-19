import { useNuxtApp } from "#app";

export function useUser() {
  const { $user } = useNuxtApp();
  return $user;
}
