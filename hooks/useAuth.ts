import { useSupabaseClient, useSupabaseUser } from "#imports";

export function useAuth() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const isAuthenticated = computed(() => !!user.value);

  return {
    supabase,
    user,
    isAuthenticated,
  };
}
