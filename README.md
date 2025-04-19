![nuxt-alazab-dashboard](https://azab.services/social-card.png)

# Nuxt Alazab Dashboard – لوحة تحكم العزب

لوحة تحكم مبنية باستخدام Nuxt 3 + Shadcn + UnoCSS  
مصممة خصيصًا لإدارة طلبات الصيانة وتحليل بيانات الفروع بواجهة احترافية.

---

## 📦 محتويات المشروع

- صفحات جاهزة:
  - `/login`: تسجيل الدخول
  - `/maintenance/requests`: طلبات الصيانة
  - `/maintenance/reports`: تقارير الأعمال
  - `/gallery`: معرض صور الأعمال
  - `/admin/users`: إدارة المستخدمين
  - `/admin/logs`: سجل الدخول
- تكامل كامل مع قاعدة بيانات **Supabase**
- واجهات حديثة باستخدام Shadcn UI
- نظام صلاحيات للمستخدمين

---

## 🚀 طريقة التشغيل

```bash
pnpm install
pnpm run dev
pnpm install xlsx
pnpm install html2pdf.js

npm install @types/html2pdf.js
npm install @types/xlsx
## 📧 إرسال تقارير الداشبورد

pnpm install nodemailer
pnpm install @types/nodemailer
pnpm install @nuxtjs/supabase
pnpm install @nuxtjs/tailwindcss
pnpm install @nuxtjs/axios

nuxt-alazab-dashboard
├── app/                           # 📲 الصفحات (مستوحاة من Expo Router لتوافق التنظيم)
│   ├── index.vue                 # 🏠 الصفحة الرئيسية
│   ├── (tabs)/                   # 📱 التبويبات السفلية
│   │   ├── maintenance.vue       # 🔧 واجهة "الصيانة"
│   │   ├── reports.vue           # 📊 التقارير
│   │   ├── notifications.vue     # 🔔 التنبيهات
│   │   ├── profile.vue           # 👤 حساب المستخدم
│   ├── maintenance/              # 🛠️ صفحات التفاصيل
│   │   ├── new-request.vue
│   │   ├── request-details.vue
│   │   ├── attachments.vue
│   │   ├── live-status.vue
│   │   ├── request-eta.vue
│   │   ├── delivery-confirmation.vue
│   │   ├── request-report.vue
│   │   ├── request-filter.vue
│   │   ├── requests/index.vue     # 📋 قائمة الطلبات
│   │   └── dashboard.vue          # 📊 لوحة التحكم
│
│
├── lib/
│   ├── supabase.ts               # 🔌 الاتصال بـ Supabase
│   └── services/                 # ⚙️ الخدمات
│       ├── authService.ts
│       ├── emailService.ts
│       ├── galleryService.ts
│       ├── invoiceService.ts
│       ├── notificationService.ts
│       ├── profileService.ts
│       ├── requestService.ts
│       └── workflowService.ts
│
├── components/                   # 🧩 مكونات الواجهة
│   ├── Card.vue
│   ├── Modal.vue
│   ├── Toast.vue
│   ├── LoadingIndicator.vue
│   ├── StatCard.vue              # 🔢 كارت إحصائي للوحة التحكم
│   ├── PieChart.vue              # 🟠 مخطط دائري للحالات
│   ├── BarChart.vue              # 📊 مخطط الأعمدة للفروع
│   └── LineChart.vue             # 📈 مخطط زمني للطلبات
│
├── context/
│   ├── AuthContext.ts
│   └── ThemeContext.ts
│
├── guards/                       # 🔐 حماية الدخول حسب الدور
│   ├── withAdminGuard.ts
│   ├── withTechnicianGuard.ts
│   └── withCustomerGuard.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useRole.ts
│
├── utils/                        # 🛠 أدوات مساعدة
│   ├── formatDate.ts
│   ├── toast.ts
│   ├── errorHandler.ts
│   ├── validators.ts
│   ├── mapPriorityColor.ts
│   ├── durationCalculator.ts
│   └── email.ts                  # 📧 إرسال بريد عبر SMTP
│
├── i18n/                         # 🌍 دعم اللغات
│   ├── en.json
│   ├── ar.json
│   └── i18n.ts
│
├── public/                       # 🌐 الصور والملفات العامة
│   ├── images/
│   ├── icons/
│   └── splash/
│
├── server/                       # 🌐 نقاط النهاية (API)
│   └── api/
│       ├── maintenance-requests.ts     # 🔁 جلب الطلبات بالفلترة
│       └── send-dashboard-email.ts     # 📧 إرسال تقرير الداشبورد بالبريد
│
├── nuxt.config.ts                # ⚙️ إعدادات Nuxt
├── package.json
├── tsconfig.json
├── app.vue                       # 🧠 المكون الرئيسي للتطبيق
├── README.md
└── .env                          # 🌱 إعدادات البيئة
```
