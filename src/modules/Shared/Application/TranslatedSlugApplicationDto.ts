import type { Locale } from '@/config/i18n.config.ts'

export type TranslatedSlugApplicationDto = {
  [key in Locale]: string
}