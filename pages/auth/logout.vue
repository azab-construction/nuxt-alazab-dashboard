<script setup lang="ts">
import { useRouter } from "vue-router";
import { signOut } from "~/lib/services/authService";

const router = useRouter();
await signOut();
router.push("/auth/login");
</script>
