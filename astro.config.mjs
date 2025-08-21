// @ts-check
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { i18nConfig } from './i18n.config.mjs'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [ tailwindcss() ],
  },
  i18n: {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    routing: {
      redirectToDefaultLocale: true,
      prefixDefaultLocale: true,
    }
  }
})
