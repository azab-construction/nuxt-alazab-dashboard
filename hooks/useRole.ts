import { computed } from "vue";
import { useUser } from "./useUser";

export function useRole() {
  const user = useUser();
  return computed(() => user.value?.user_metadata?.role || "guest");
}
