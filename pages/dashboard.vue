<script setup lang="ts">
import NumberFlow from "@number-flow/vue";
import { Activity, CreditCard, DollarSign, Users } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const summaryCards = ref([
  {
    title: "إجمالي الإيرادات",
    icon: DollarSign,
    value: 0,
    format: {
      style: "currency",
      currency: "USD",
      trailingZeroDisplay: "stripIfInteger",
    },
    delta: 0,
    deltaFormat: { style: "percent", minimumFractionDigits: 1 },
    deltaPrefix: "+",
    deltaSuffix: "من الشهر الماضي",
    prefix: "",
  },
  {
    title: "الاشتراكات",
    icon: Users,
    value: 0,
    delta: 0,
    deltaFormat: { style: "percent", minimumFractionDigits: 1 },
    deltaPrefix: "+",
    deltaSuffix: "من الشهر الماضي",
    format: {},
    prefix: "+",
  },
  {
    title: "المبيعات",
    icon: CreditCard,
    value: 0,
    delta: 0,
    deltaFormat: { style: "percent", minimumFractionDigits: 1 },
    deltaPrefix: "+",
    deltaSuffix: "من الشهر الماضي",
    format: {},
    prefix: "+",
  },
  {
    title: "النشطين الآن",
    icon: Activity,
    value: 0,
    delta: 0,
    deltaPrefix: "+",
    deltaSuffix: "من الساعة الماضية",
    format: {},
    prefix: "+",
  },
]);

const dataRecentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999 },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39 },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 299 },
  { name: "William Kim", email: "will@email.com", amount: 99 },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

onMounted(() => {
  summaryCards.value[0].value = 45231.89;
  summaryCards.value[0].delta = 20.1 / 100;

  summaryCards.value[1].value = 2350;
  summaryCards.value[1].delta = 180.5 / 100;

  summaryCards.value[2].value = 12234;
  summaryCards.value[2].delta = 45 / 100;

  summaryCards.value[3].value = 573;
  summaryCards.value[3].delta = 201;
});
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- رأس الصفحة -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <Button>تحميل البيانات</Button>
      </div>
    </div>

    <!-- محتوى لوحة التحكم -->
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <!-- الكروت الرئيسية -->
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
        <Card v-for="card in summaryCards" :key="card.title">
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">
              {{ card.title }}
            </CardTitle>
            <component :is="card.icon" class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="card.value"
                :format="card.format"
                :prefix="card.prefix"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow
                :value="card.delta"
                :format="card.deltaFormat"
                :prefix="card.deltaPrefix"
              />
              {{ card.deltaSuffix }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- المخطط والمبيعات -->
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-2">
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <DashboardOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المبيعات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-8">
            <div
              v-for="sale in dataRecentSales"
              :key="sale.name"
              class="flex items-center gap-4"
            >
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{{ getInitials(sale.name) }}</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  {{ sale.name }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ sale.email }}
                </p>
              </div>
              <div class="ml-auto font-medium">
                <NumberFlow
                  :value="sale.amount"
                  :format="{
                    style: 'currency',
                    currency: 'USD',
                    trailingZeroDisplay: 'stripIfInteger',
                  }"
                  prefix="+"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
