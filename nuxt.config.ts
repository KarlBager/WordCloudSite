// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
  head: {
    bodyAttrs: {
      class: 'fade-in',
    },
    link: [{ rel: 'stylesheet', href: 'https://use.typekit.net/byd1adg.css' }, { rel: 'icon', href: 'media/favicon.png' }]
  }
},
})
