<script setup lang="ts">
import { useUser } from "~/hooks/useUser";
import { getProfile } from "~/lib/services/profileService";

const user = useUser();
const { data } = await getProfile(user.value.id);
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold">الملف الشخصي</h2>
    <div v-if="data">
      <p>الاسم: {{ data.full_name }}</p>
      <p>البريد: {{ data.email }}</p>
      <p>الدور: {{ data.role }}</p>
    </div>
  </div>
</template>
