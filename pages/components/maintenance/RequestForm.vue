<script setup lang="ts">
import { computed, ref } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const maintenanceForm = ref({
  store_id: "",
  title: "",
  description: "",
  priority: "medium",
  service_type: "maintenance",
  primary_service_id: null,
  scheduled_date: "",
});

const { data: stores } = await useAsyncData("stores", async () => {
  const { data, error } = await supabase
    .from("stores")
    .select("id, name, region_id")
    .eq("is_deleted", false)
    .order("name");
  if (error) throw error;
  return data;
});

const { data: services } = await useAsyncData("services", async () => {
  const { data, error } = await supabase
    .from("maintenance_services")
    .select("id, name, category, estimated_cost")
    .eq("is_active", true)
    .order("category, name");
  if (error) throw error;
  return data;
});

const { data: regions } = await useAsyncData("regions", async () => {
  const { data, error } = await supabase
    .from("regions")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
});

const servicesByCategory = computed(() => {
  if (!services.value) return {};
  return services.value.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});
});

const selectedRegion = ref("");
const filteredStores = computed(() => {
  if (!stores.value) return [];
  if (!selectedRegion.value) return stores.value;
  return stores.value.filter(
    (store) => store.region_id === selectedRegion.value,
  );
});

const _storesError = ref("");
const _servicesError = ref("");
const _regionsError = ref("");

const toast = useToast();
const showNotification = (message: string, type: "success" | "error") => {
  toast[type](message);
};

async function submitRequest() {
  try {
    if (
      !maintenanceForm.value.store_id ||
      !maintenanceForm.value.title ||
      !maintenanceForm.value.description
    ) {
      throw new Error("يرجى ملء جميع الحقول المطلوبة");
    }

    const { data, error } = await supabase
      .from("maintenance_requests")
      .insert({
        ...maintenanceForm.value,
        created_by: user.value?.id,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    await supabase.from("history").insert({
      request_id: data[0].id,
      user_id: user.value?.id,
      action: "create",
      details: "تم إنشاء طلب صيانة جديد",
    });

    await supabase.from("workflow_steps").insert([
      {
        request_id: data[0].id,
        step_name: "استلام الطلب",
        status: "completed",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      },
      {
        request_id: data[0].id,
        step_name: "تعيين فني",
        status: "pending",
      },
      {
        request_id: data[0].id,
        step_name: "بدء العمل",
        status: "pending",
      },
      {
        request_id: data[0].id,
        step_name: "إكمال العمل",
        status: "pending",
      },
    ]);

    maintenanceForm.value = {
      store_id: "",
      title: "",
      description: "",
      priority: "medium",
      service_type: "maintenance",
      primary_service_id: null,
      scheduled_date: "",
    };

    // إشعار بديل عن alert:
    showNotification("تم إرسال الطلب بنجاح", "success");

    navigateTo(`/maintenance-requests/${data[0].id}`);
  } catch (error: any) {
    showNotification(`خطأ: ${error.message}`, "error");
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">نموذج طلب صيانة جديد</h2>
    </template>

    <UForm :state="maintenanceForm" @submit="submitRequest">
      <UFormGroup v-if="regions" label="المنطقة">
        <USelect
          v-model="selectedRegion"
          :options="
            regions.map((region) => ({ label: region.name, value: region.id }))
          "
          placeholder="اختر المنطقة (اختياري)"
          clearable
        />
      </UFormGroup>

      <UFormGroup label="المتجر" required>
        <USelect
          v-model="maintenanceForm.store_id"
          :options="
            filteredStores.map((store) => ({
              label: store.name,
              value: store.id,
            }))
          "
          placeholder="اختر المتجر"
          required
        />
      </UFormGroup>

      <UFormGroup label="عنوان الطلب" required>
        <UInput
          v-model="maintenanceForm.title"
          placeholder="أدخل عنوان الطلب"
          required
        />
      </UFormGroup>

      <UFormGroup label="وصف الطلب" required>
        <UTextarea
          v-model="maintenanceForm.description"
          placeholder="اشرح المشكلة بالتفصيل"
          rows="4"
          required
        />
      </UFormGroup>

      <UFormGroup label="نوع الخدمة">
        <URadioGroup
          v-model="maintenanceForm.service_type"
          :options="[
            { label: 'صيانة', value: 'maintenance' },
            { label: 'تجديد', value: 'renovation' },
          ]"
          orientation="horizontal"
        />
      </UFormGroup>

      <UFormGroup label="الأولوية">
        <URadioGroup
          v-model="maintenanceForm.priority"
          :options="[
            { label: 'منخفضة', value: 'low' },
            { label: 'متوسطة', value: 'medium' },
            { label: 'عالية', value: 'high' },
            { label: 'عاجلة', value: 'urgent' },
          ]"
          orientation="horizontal"
        />
      </UFormGroup>

      <UFormGroup label="الخدمة الأساسية">
        <USelect
          v-model="maintenanceForm.primary_service_id"
          :options="
            Object.entries(servicesByCategory).map(([category, services]) => ({
              label: category,
              options: services.map((service) => ({
                label: service.name,
                value: service.id,
                description: `التكلفة التقديرية: ${service.estimated_cost}`,
              })),
            }))
          "
          placeholder="اختر الخدمة الأساسية"
        />
      </UFormGroup>

      <UFormGroup label="التاريخ المفضل للصيانة">
        <UInput
          v-model="maintenanceForm.scheduled_date"
          type="datetime-local"
        />
      </UFormGroup>

      <div class="mt-4 flex justify-end gap-2">
        <UButton type="button" color="gray" @click="$router.back()"
          >إلغاء</UButton
        >
        <UButton type="submit" color="primary">إرسال الطلب</UButton>
      </div>
    </UForm>
  </UCard>
</template>
