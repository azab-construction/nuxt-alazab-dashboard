<!-- components/auth/LogoutButton.vue -->
<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // ✅ إعادة التوجيه لصفحة الدخول بعد الخروج
    router.push("/login");
  } catch (err) {
    console.error("خطأ أثناء تسجيل الخروج:", err);
    // هنا ممكن تضيف toast أو إشعار
  }
}
</script>

<template>
  <UButton color="red" @click="logout"> تسجيل الخروج </UButton>
</template>
