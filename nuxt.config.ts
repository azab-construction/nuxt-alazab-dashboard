export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@unocss/nuxt",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/devtools",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@nuxt/content",
    "@formkit/nuxt",
    "@nuxt/test-utils",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/html-validator",
    "@nuxtjs/fontaine",
    "nuxt-vitest",
    "@nuxtjs/device",
    "@nuxtjs/partytown",
  ],

  css: ["@unocss/reset/tailwind.css", "~/assets/css/main.css"],

  colorMode: { classSuffix: "" },
  features: { inlineStyles: false },

  eslint: { config: { standalone: false } },

  routeRules: {
    "/components": { redirect: "/components/accordion" },
    "/settings": { redirect: "/settings/profile" },
    "/:catchAll(.*)": { redirect: "/landing" },
    "/api/**": { cors: true },
    "/blog/**": { swr: 3600 },
    "/docs/**": { static: true },
  },

  imports: {
    dirs: ["./lib", "./composables", "./utils"],
  },

  runtimeConfig: {
    emailService: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    aiApiKey: process.env.AI_API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    nuxthub: {
      apiKey: process.env.NUXTHUB_API_KEY,
      projectId: process.env.NUXTHUB_PROJECT_ID,
      environment: process.env.NUXTHUB_ENVIRONMENT
    },
    public: {
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      SUPABASE_ANON_KEY: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://azab.services",
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      maintenanceMode: process.env.NUXT_PUBLIC_MAINTENANCE_MODE === "true",
    },
  },

  i18n: {
    locales: [
      {
        code: "ar",
        name: "العربية",
        iso: "ar-EG",
        file: "ar.json",
        dir: "rtl",
      },
      {
        code: "en",
        name: "English",
        iso: "en-US",
        file: "en.json",
        dir: "ltr",
      },
    ],
    defaultLocale: "ar",
    lazy: true,
    langDir: "i18n/",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "ar",
    },
    vueI18n: "./i18n/i18n.ts",
  },

  ui: {
    icons: ["heroicons", "lucide", "mdi", "tabler"],
    notifications: {
      position: "top-right",
      duration: 5000,
    },
  },

  nitro: {
    experimental: { openAPI: true },
    storage: {
      db: { driver: "fs", base: "./.data/db" },
      cache: { driver: "fs", base: "./.data/cache" },
    },
    devStorage: {
      db: { driver: "fs", base: "./.data/db" },
    },
  },

  app: {
    head: {
      titleTemplate: "%s - تطبيق خدمات الصيانة المعمارية",
      meta: [
        {
          name: "description",
          content: "منصة متكاملة لخدمات الصيانة المعمارية",
        },
        { name: "theme-color", content: "#ffffff" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  content: {
    documentDriven: true,
    markdown: {
      toc: { depth: 3, searchDepth: 3 },
    },
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
    },
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: ["/"],
    },
  },

  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || "https://azab.services",
  },

  compatibilityDate: "2023-12-14",

  nuxthub: {
    storage: {
      driver: 'fs',
      base: './.data'
    },
    
    auth: {
      enabled: true,
      strategies: {
        local: {
          token: {
            property: 'token',
            global: true,
            required: true,
            type: 'Bearer'
          },
          user: {
            property: 'user',
            autoFetch: true
          },
          endpoints: {
            login: { url: '/api/auth/login', method: 'post' },
            logout: { url: '/api/auth/logout', method: 'post' },
            user: { url: '/api/auth/user', method: 'get' }
          }
        }
      }
    },
    
    database: {
      enabled: true,
      driver: 'fs',
      base: './.data/db'
    },
    
    cache: {
      enabled: true,
      driver: 'fs',
      base: './.data/cache'
    },

    deploy: {
      target: 'production',
      autoDeploy: true,
      compatibilityDate: "2023-12-14",
      branch: 'main'
    }
  },
});
  
