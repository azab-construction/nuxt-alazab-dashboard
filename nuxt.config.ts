import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  telemetry: false,

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
    '@nuxtjs/device',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-icon',
  ],

  css: ['@/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  routeRules: {
    '/': { redirect: '/maintenance' },
    '/maintenance/**': {
      ssr: true,
      middleware: ['maintenance']
    },
    '/api/**': { cors: true }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: 'نظام إدارة الصيانة',
      appVersion: '1.0.0'
    }
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'ar', iso: 'ar-EG', dir: 'rtl' },
      { code: 'en', iso: 'en-US', dir: 'ltr' }
    ],
    defaultLocale: 'ar',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }  
  },

  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/*']
    }
  },

  sitemap: {
    hostname: process.env.BASE_URL || 'http://localhost:3000',
    gzip: true,
    exclude: ['/auth/**']
  },

  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore']
    ]
  },

  experimental: {
    treeshakeClientOnly: true,
    asyncContext: true
  },

  router: {
    options: {
      hashMode: true
    }
  },

  build: {
    transpile: [
      'vue-i18n',
      'vee-validate'
    ],
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    },
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  nitro: {
    storage: {
      cache: {
        driver: 'fs',
        base: './.cache'
      }
    },
    compressPublicAssets: true,
    minify: true
  },

  app: {
    head: {
      title: 'نظام إدارة الصيانة',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'نظام إدارة الصيانة' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})


