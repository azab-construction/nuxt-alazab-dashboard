<script setup lang="ts">
import { useUser } from "~/hooks/useUser";
import { fetchNotifications } from "~/lib/services/notificationService";

const user = useUser();
const { data } = await fetchNotifications(user.value.id);
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-xl font-bold">التنبيهات</h2>
    <ul v-if="data?.length">
      <li v-for="note in data" :key="note.id" class="border-b py-2">
        {{ note.message }}
      </li>
    </ul>
    <p v-else>لا توجد تنبيهات حاليًا</p>
  </div>
</template>
