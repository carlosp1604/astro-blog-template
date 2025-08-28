export type LocaleCode = 'es' | 'en'

export class Locale {
  private constructor(public readonly value: LocaleCode) {
  }
  static create(raw: string, supported: LocaleCode[], defaultLocale: LocaleCode): Locale {
    if (supported.includes(raw as LocaleCode)) {
      return new Locale(raw as LocaleCode)
    }

    return new Locale(defaultLocale)
  }
}
