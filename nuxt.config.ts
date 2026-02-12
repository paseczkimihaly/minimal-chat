
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    config: {
      darkMode: 'class',
    },
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  runtimeConfig: {
    mongodbUri: process.env.NUXT_MONGODB_URI,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  },
})
