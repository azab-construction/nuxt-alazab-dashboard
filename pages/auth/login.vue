<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "~/lib/services/authService";
import { showError, showSuccess } from "~/utils/toast";

const form = ref({ email: "", password: "" });
const router = useRouter();

async function handleLogin() {
  const { error } = await signIn(form.value.email, form.value.password);
  if (error) return showError("بيانات غير صحيحة");
  showSuccess("مرحبًا بك");
  router.push("/(tabs)/maintenance");
}
</script>

<template>
  <div class="mx-auto max-w-md p-6">
    <h2 class="mb-4 text-xl font-bold">تسجيل الدخول</h2>
    <UInput
      v-model="form.email"
      type="email"
      placeholder="البريد الإلكتروني"
      class="mb-3"
    />
    <UInput
      v-model="form.password"
      type="password"
      placeholder="كلمة المرور"
      class="mb-3"
    />
    <UButton block color="primary" @click="handleLogin"> دخول </UButton>
  </div>
</template>
