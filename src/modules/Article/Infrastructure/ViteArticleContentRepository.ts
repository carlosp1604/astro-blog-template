import { asSafeLocale } from '@/modules/Shared/Infrastructure/SafeLocale.ts'
import { CONTENT_BASE_PATH } from '@/config/constants.ts'
import type { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { ArticleContentRepositoryInterface } from '@/modules/Article/Domain/ArticleContentRepositoryInterface'

export class ViteArticleContentRepository implements ArticleContentRepositoryInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly mdxFiles: Record<string, () => any>

  constructor(private readonly loggerService: LoggerServiceInterface) {
    this.mdxFiles = import.meta.glob('/src/content/**/*.mdx')
  }

  /**
   * Retrieves the compiled content component for the given file path
   * @param slug
   * @param locale
   * @returns A Promise that resolves to the compiled component (the default export) or null if the file is not found
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async get(locale: Locale, slug: ArticleSlug): Promise<any | null> {
    const safeLocale = asSafeLocale(locale.value)

    const normalizedPath = `${CONTENT_BASE_PATH}/${safeLocale}/${slug.value}.mdx`

    const loader = this.mdxFiles[normalizedPath]

    if (!loader) {
      this.loggerService.warn(`MDX File not found in glob: ${normalizedPath}`, {
        path: normalizedPath,
        availableKeys: Object.keys(this.mdxFiles).slice(0, 5)
      })

      return null
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await loader() as any

      return mod.default
    } catch (exception: unknown) {
      const stack = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Critical error while compiling MDX: ${normalizedPath}`, stack, {
        path: normalizedPath,
        error: exception
      })

      return null
    }
  }
}
