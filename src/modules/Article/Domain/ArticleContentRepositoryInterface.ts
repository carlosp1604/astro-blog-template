import type { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'

export interface ArticleContentRepositoryInterface {
  /**
   * Retrieves the compiled content component for the given file path.
   * @param slug
   * @param locale
   * @returns A Promise that resolves to the compiled component (the default export) or null if the file is not found.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(locale: Locale, slug: ArticleSlug): Promise<any | null>
}
