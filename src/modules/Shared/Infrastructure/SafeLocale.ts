import type { Locale as LocaleType } from '@/config/i18n.config.ts'

export function asSafeLocale(locale: string): LocaleType {
  return locale as LocaleType
}
