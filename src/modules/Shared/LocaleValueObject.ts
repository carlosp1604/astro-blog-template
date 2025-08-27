export class Locale {
  private constructor(public readonly value: string) {
  }

  static create(raw: string, supported: string[], defaultLocale: string): Locale {
    if (supported.includes(raw)) {
      return new Locale(raw)
    }

    return new Locale(defaultLocale)
  }
}