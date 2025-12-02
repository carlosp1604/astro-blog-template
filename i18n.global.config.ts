/* Translations files -> src/translations/{locale}/{namespace}.json */

const locales = [ 'en', 'es' ] as const
const defaultLocale: typeof locales[number] = 'en'
const namespaces = [ 'common', 'home', 'tags', 'articles', 'categories' ] as const

export const i18nGlobalConfig = {
  locales,
  defaultLocale,
  namespaces
}
