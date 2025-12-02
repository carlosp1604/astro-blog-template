// @ts-check
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { i18nGlobalConfig } from './i18n.global.config'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_BASE_URL,
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  vite: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    plugins: [ tailwindcss() ]
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: i18nGlobalConfig.defaultLocale,
        locales: i18nGlobalConfig.locales.reduce<Record<string, string>>((accumulate, locale) => {
          accumulate[locale] = locale

          return accumulate
        }, {})
      },
      filter: (page) =>
        page !== import.meta.env.PUBLIC_SITE_BASE_URL + '/404/' &&
        page !== import.meta.env.PUBLIC_SITE_BASE_URL + '/500/'
    })
  ],

  trailingSlash: 'always',

  i18n: {
    defaultLocale: i18nGlobalConfig.defaultLocale as never,
    locales: [ ...i18nGlobalConfig.locales ],
    routing: {
      redirectToDefaultLocale: true,
      prefixDefaultLocale: true
    }
  }
})
