import { i18nConfig as i18nGlobalConfig } from '~/i18n.config.mjs'

const supportedLanguages = [ ...i18nGlobalConfig.locales ] as const

export const namespaces = [ ...i18nGlobalConfig.namespaces ] as const

export type Locale = typeof supportedLanguages[number]
export type Namespace = typeof namespaces[number]

/* Translations files -> locales/en/common.js */

export interface I18nConfig {
  locales: readonly Locale[]
  defaultLocale: Locale
  namespaces: readonly Namespace[]
}

export const i18nConfig: I18nConfig = {
  defaultLocale: i18nGlobalConfig.defaultLocale,
  locales: supportedLanguages,
  namespaces
}