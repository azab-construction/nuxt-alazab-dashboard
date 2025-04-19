<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser, useToast } from "#imports";
import { computed, ref } from "vue";
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

const form = ref({
  title: "",
  store_id: "",
  primary_service_id: "",
  description: "",
  priority: "متوسطة",
  scheduled_date: "",
});
const files = ref<File[]>([]);
const loading = ref(false);

const priorityOptions = [
  { label: "منخفضة", value: "منخفضة" },
  { label: "متوسطة", value: "متوسطة" },
  { label: "عالية", value: "عالية" },
  { label: "حرجة", value: "حرجة" },
];

const minDate = computed(() => new Date().toISOString().split("T")[0]);

const { data: storesData } = await useFetch("/api/stores");
const stores = computed(() => storesData.value || []);

const { data: servicesData } = await useFetch("/api/maintenance-services");
const services = computed(() => servicesData.value || []);

const selectedService = computed(() => {
  return services.value.find((s) => s.id === form.value.primary_service_id);
});

function updateEstimates() {
  if (selectedService.value) {
    form.value.estimated_cost = selectedService.value.estimated_cost;
  }
}

const schema = z.object({
  title: z.string().min(5),
  store_id: z.string().uuid(),
  primary_service_id: z.string().uuid(),
  description: z.string().min(10),
  priority: z.string(),
  scheduled_date: z.string().min(1),
});

async function submitRequest() {
  loading.value = true;

  try {
    const { data: request, error } = await supabase
      .from("maintenance_requests")
      .insert({
        ...form.value,
        status: "pending",
        created_by: user.value.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    for (const file of files.value) {
      const ext = file.name.split(".").pop();
      const path = `${request.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("maintenance-attachments")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: url } = supabase.storage
        .from("maintenance-attachments")
        .getPublicUrl(path);

      await supabase.from("attachments").insert({
        request_id: request.id,
        file_url: url.publicUrl,
        uploaded_by: user.value.id,
        uploaded_at: new Date().toISOString(),
      });
    }

    await supabase.from("request_status_log").insert({
      request_id: request.id,
      status: "pending",
      changed_by: user.value.id,
      changed_at: new Date().toISOString(),
    });

    await supabase.from("workflow_steps").insert({
      request_id: request.id,
      step_name: "إنشاء الطلب",
      status: "completed",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

    await sendRequestEmail(request);

    toast.add({ title: "تم إرسال الطلب بنجاح", color: "green" });
    navigateTo(`/maintenance/requests/${request.id}`);
  } catch (e) {
    console.error(e);
    toast.add({ title: "حدث خطأ أثناء الإرسال", color: "red" });
  } finally {
    loading.value = false;
  }
}

async function sendRequestEmail(request: any) {
  const storeName =
    stores.value.find((s) => s.id === request.store_id)?.name || "";

  await $fetch("/api/send-request-email", {
    method: "POST",
    body: {
      to: [user.value.email, "manager@company.com"],
      title: request.title,
      description: request.description,
      store_name: storeName,
      scheduled_date: request.scheduled_date,
      priority: request.priority,
      id: request.id,
    },
  });
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
    <h1 class="mb-6 text-2xl font-bold">طلب خدمة صيانة جديدة</h1>

    <UForm :schema="schema" :state="form" @submit="submitRequest">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UFormGroup label="عنوان الطلب" name="title" class="col-span-2">
          <UInput
            v-model="form.title"
            placeholder="مثال: عطل في التكييف الرئيسي"
          />
        </UFormGroup>

        <UFormGroup label="المتجر" name="store_id">
          <USelect
            v-model="form.store_id"
            :options="stores"
            option-attribute="name"
            value-attribute="id"
            placeholder="اختر المتجر"
          />
        </UFormGroup>

        <UFormGroup label="نوع الخدمة" name="primary_service_id">
          <USelect
            v-model="form.primary_service_id"
            :options="services"
            option-attribute="name"
            value-attribute="id"
            placeholder="اختر نوع الخدمة"
            @update:model-value="updateEstimates"
          />
        </UFormGroup>

        <UFormGroup label="الأولوية" name="priority">
          <URadioGroup
            v-model="form.priority"
            :options="priorityOptions"
            class="flex gap-4"
          />
        </UFormGroup>

        <UFormGroup label="التاريخ المطلوب" name="scheduled_date">
          <UInput v-model="form.scheduled_date" type="date" :min="minDate" />
        </UFormGroup>

        <UFormGroup label="الوصف" name="description" class="col-span-2">
          <UTextarea
            v-model="form.description"
            rows="5"
            placeholder="يرجى وصف المشكلة بالتفصيل..."
          />
        </UFormGroup>

        <UFormGroup label="إرفاق صور" name="attachments" class="col-span-2">
          <UFileInput
            v-model="files"
            multiple
            accept="image/*"
            placeholder="اختر الملفات أو اسحبها هنا"
          />
        </UFormGroup>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <div v-if="selectedService">
          <p class="text-sm text-gray-500">
            💰 تكلفة تقديرية:
            <strong>{{ selectedService.estimated_cost }} ريال</strong>
          </p>
          <p class="text-sm text-gray-500">
            ⏱ وقت تقديري:
            <strong>{{ selectedService.estimated_time }} ساعة</strong>
          </p>
        </div>
        <UButton type="submit" :loading="loading" color="primary">
          إرسال الطلب
        </UButton>
      </div>
    </UForm>
  </div>
</template>
