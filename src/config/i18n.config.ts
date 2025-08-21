const supportedLanguages = [ 'en', 'es' ] as const

export const namespaces = [ 'common', 'home', 'post' ] as const

export type Locale = typeof supportedLanguages[number]
export type Namespace = typeof namespaces[number]

/* Translations files -> locales/en/common.js */

export interface I18nConfig {
  locales: readonly Locale[]
  defaultLocale: Locale
  namespaces: readonly Namespace[]
}

export const i18nConfig: I18nConfig = {
  defaultLocale: 'en',
  locales: supportedLanguages,
  namespaces
}