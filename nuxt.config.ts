// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 模块
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  // 运行时配置
  runtimeConfig: {
    // 私有变量 (仅服务端)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.NUXT_SESSION_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,

    // 公开变量 (客户端可访问)
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'My CMS',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      storageProxyPrefix: process.env.NUXT_PUBLIC_STORAGE_PROXY_PREFIX || '',
      defaultLocale: process.env.NUXT_PUBLIC_DEFAULT_LOCALE || 'zh-CN',
      supportedLocales: process.env.NUXT_PUBLIC_SUPPORTED_LOCALES || 'zh-CN,en',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      gaEnabled: process.env.NUXT_PUBLIC_GA_ENABLED === 'true',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  // CSS
  css: ['~/assets/css/tailwind.css'],

  // PostCSS
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // 主题/颜色模式配置
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
  },

  // 国际化配置
  i18n: {
    locales: [
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'zh-CN',
    langDir: '../locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false, // 暂时禁用，待问题修复
  },

  // 应用配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: process.env.NUXT_PUBLIC_SEO_TITLE || 'My CMS',
      meta: [
        { name: 'description', content: process.env.NUXT_PUBLIC_SEO_DESCRIPTION || '' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // 导入自动配置
  imports: {
    dirs: ['composables/**', 'utils/**'],
  },

  // 组件自动导入
  components: [
    { path: '~/components/ui', prefix: '' },
    { path: '~/components/common', prefix: '' },
    { path: '~/components/layout', prefix: '' },
    '~/components',
  ],
})
