// @ts-check
import mdx from '@astrojs/mdx'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { env } from './env.loader.ts'
import { defineConfig } from 'astro/config'
import { i18nGlobalConfig } from './i18n.global.config'

const { PUBLIC_SITE_BASE_URL } = env

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_BASE_URL,
  output: 'server',
  vite: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    plugins: [ tailwindcss() ]
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: false
  }),
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
        page !== PUBLIC_SITE_BASE_URL + '/404/' &&
        page !== PUBLIC_SITE_BASE_URL + '/500/'
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
