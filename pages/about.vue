<script setup lang="ts">
import html2pdf from "html2pdf.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const pdfRef = ref(null);

function goToDashboard() {
  router.push("/dashboard");
}

function downloadPDF() {
  html2pdf()
    .from(pdfRef.value)
    .set({
      margin: 1,
      filename: "حول-تطبيق-azab.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { format: "a4", orientation: "portrait" },
    })
    .save();
}
</script>

<template>
  <div
    ref="pdfRef"
    class="mx-auto max-w-4xl min-h-screen bg-white px-6 py-12 text-gray-800 space-y-8"
  >
    <div class="flex justify-center">
      <img
        src="/images/alazab-logo.png"
        alt="شعار شركة العزب"
        class="mb-6 h-16"
      />
    </div>

    <h1 class="text-3xl text-blue-700 font-bold">
      🧠 كيف يعمل تطبيق Azab للصيانة؟
    </h1>

    <p>
      تطبيق Azab يقدم تجربة ذكية وشاملة لإدارة طلبات الصيانة في الشركات متعددة
      الفروع. النظام يغطي كامل دورة الحياة لأي طلب، من البلاغ وحتى التوثيق
      وإغلاق الحالة.
    </p>

    <ul class="list-disc list-inside text-gray-700 space-y-2">
      <li>
        <strong>إرسال الطلب:</strong> المستخدم يقوم بملء نموذج بسيط مع تحديد
        المتجر، نوع الخدمة، والأولوية.
      </li>
      <li>
        <strong>رفع المرفقات:</strong> يمكن إرفاق صور مباشرة أثناء تقديم الطلب.
      </li>
      <li>
        <strong>التوثيق الآلي:</strong> يتم حفظ حالة الطلب وتسجيلها في سجل
        الحالة ومرحلة التدفق (workflow).
      </li>
      <li>
        <strong>الإشعارات:</strong> يتم إرسال بريد للمستخدم والمدير تلقائيًا عند
        كل خطوة مهمة.
      </li>
      <li>
        <strong>التنفيذ والمتابعة:</strong> يظهر الطلب في لوحة الطلبات، ويمكن
        متابعة حالته لحظيًا.
      </li>
      <li>
        <strong>إغلاق الطلب:</strong> يمكن تأكيد التسليم بالتوقيع، ورفع تقرير
        فني نهائي.
      </li>
      <li>
        <strong>لوحة التحكم:</strong> يتم تحليل الأداء تلقائيًا وإظهار تقارير
        بالرسوم البيانية.
      </li>
    </ul>

    <hr class="my-6" />

    <h2 class="text-2xl text-green-700 font-bold">
      🎯 لماذا تم إنشاء تطبيق Azab للصيانات المعمارية؟
    </h2>
    <p>💡 مشكلة حقيقية تواجهها الشركات متعددة الفروع:</p>
    <ul class="list-disc list-inside text-gray-700 space-y-2">
      <li>لا يوجد مخطط واضح أو نظام موحد لمتابعة الصيانات.</li>
      <li>
        تتراكم الأعطال الصغيرة لتصبح مشاكل كبيرة تؤثر على العمليات اليومية.
      </li>
    </ul>

    <h3 class="mt-4 text-xl font-semibold">
      ❗️ تأثير ذلك على الإدارات المختلفة داخل الشركة
    </h3>
    <div class="border rounded bg-gray-50 p-4 text-sm">
      <p>
        <strong>🧾 إدارة الحسابات:</strong> لا تستطيع إعداد الميزانيات بدقة بسبب
        عدم وضوح التكاليف الفعلية.
      </p>
      <p>
        <strong>🛍 إدارة المشتريات:</strong> تواجه صعوبة في توفير قطع الغيار
        لغياب طلبات منظمة وموثقة.
      </p>
      <p>
        <strong>🧪 إدارة التشغيل:</strong> تنشغل عن المهام الأساسية بالبحث عن
        حلول مؤقتة لكل فرع.
      </p>
      <p>
        <strong>🏗 الإدارة الهندسية:</strong> تُرهق بالمتابعة اليدوية، والاتصال
        المستمر مع الفنيين، دون سجل رقمي موحد.
      </p>
      <p>
        <strong>📊 الإدارة العليا:</strong> تفتقد الرؤية الشاملة لحالة الفروع
        مما يعيق اتخاذ قرارات استراتيجية.
      </p>
    </div>

    <p class="mt-4">
      🛠 <strong>هنا يأتي دور التطبيق</strong><br />
      <strong>Azab Maintenance App</strong> هو حل ذكي شامل صُمم خصيصًا لتغطية
      كامل دورة حياة الصيانة للفروع التجارية، من أول بلاغ وحتى صدور الفاتورة، مع
      تقارير فورية ودعم للتكامل مع الإدارات الأخرى.
    </p>

    <h3 class="mt-4 text-xl font-semibold">✅ ماذا يوفر التطبيق؟</h3>
    <ul class="list-disc list-inside text-gray-700 space-y-1">
      <li>لوحة تحكم لحالة كل فرع.</li>
      <li>طلبات صيانة مفصلة موثقة بالصور والتقارير.</li>
      <li>إشعارات تلقائية لكل الأطراف.</li>
      <li>تحليلات أداء الفروع والفنيين.</li>
      <li>أرشفة لجميع العمليات.</li>
      <li>ربط مباشر مع نظام المشتريات والمحاسبة والتشغيل.</li>
    </ul>

    <h3 class="mt-4 text-xl font-semibold">🚀 النتيجة النهائية؟</h3>
    <ul class="list-disc list-inside text-gray-700 space-y-1">
      <li>شفافية كاملة في إدارة الصيانة.</li>
      <li>قرارات أسرع وأكثر دقة.</li>
      <li>رضا العملاء الداخليين (مديري الفروع).</li>
      <li>توفير في الوقت والتكاليف.</li>
      <li>أداء هندسي وتنفيذي أكثر احترافًا.</li>
    </ul>

    <div class="mt-8 space-y-2">
      <UButton color="primary" @click="goToDashboard">
        🚀 الذهاب إلى لوحة التحكم
      </UButton>
      <UButton color="gray" @click="downloadPDF">
        📥 تحميل الصفحة كـ PDF
      </UButton>
      <p class="text-sm text-gray-500">
        للمزيد عن شركة العزب:
        <a
          href="https://al-azab.co"
          target="_blank"
          class="text-blue-600 underline"
          >www.al-azab.co</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
h1,
h2,
h3 {
  font-family: "Cairo", sans-serif;
}
</style>
