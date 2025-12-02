import { asSafeLocale } from '@/modules/Shared/Infrastructure/SafeLocale.ts'
import { TagModelTranslator } from '@/modules/Tag/Infrastructure/TagModelTranslator.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import type { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { TagSlug } from '@/modules/Tag/Domain/ValueObject/TagSlug.ts'
import type { TagJsonModel } from '@/modules/Tag/Infrastructure/TagJsonModel.ts'
import type { ArticleJsonModel } from '@/modules/Article/Infrastructure/ArticleJsonModel.ts'
import type { TagRepositoryInterface } from '@/modules/Tag/Domain/TagRepositoryInterface.ts'

class CollatorFactory {
  private static cache = new Map<string, Intl.Collator>()

  static get(locale: string): Intl.Collator {
    if (!this.cache.has(locale)) {
      this.cache.set(locale, new Intl.Collator(locale, { sensitivity: 'base', ignorePunctuation: true }))
    }

    return this.cache.get(locale)!
  }
}

export class FileSystemTagRepository implements TagRepositoryInterface {
  constructor(
    private readonly articles: Array<ArticleJsonModel>,
    private readonly tags: Array<TagJsonModel>
  ) {}

  /**
   * Get a Tag given its slug
   * @param slug Tag slug
   * @param locale Language in which Tag entity must be translated
   * @return Tag if found or null
   */
  public async getTagBySlug(slug: TagSlug, locale: Locale): Promise<Tag | null> {
    const tag = this.tags.find((tag) => {
      for (const translatedSlug of Object.values(tag.slugs)) {
        if (translatedSlug === slug.value) {
          return true
        }
      }

      return false
    })

    if (!tag) {
      return null
    }

    const safeLocale = asSafeLocale(locale.value)

    return TagModelTranslator.toDomain({
      id: tag.id,
      name: tag.translations[safeLocale].name,
      // FIXME: V1 -> Not optimized query
      articlesCount: this.articles.filter((article) =>
        article.tags.includes(tag.id) && article.locale === safeLocale).length,
      slug: tag.slugs[safeLocale]
    })
  }

  /**
   * Get all Tags given a locale
   * @param locale Language in which Tag entities must be translated
   * @return Array of Tag
   */
  public async getAllTags(locale: Locale): Promise<Array<Tag>> {
    const safeLocale = asSafeLocale(locale.value)

    return this.tags
      .filter((tag) => tag.slugs[safeLocale])
      .sort((a, b) => CollatorFactory.get(locale.value).compare(a.translations[safeLocale].name, b.translations[safeLocale].name))
      .map((tag) => {
        return TagModelTranslator.toDomain({
          id: tag.id,
          name: tag.translations[safeLocale].name,
          // FIXME: V1 -> Not optimized query
          articlesCount: this.articles.filter((article) =>
            article.tags.includes(tag.id) && article.locale === safeLocale).length,
          slug: tag.slugs[safeLocale]
        })
      })
  }

  /**
   * Get all slugs from a Tag given its ID
   * @param id Tag ID
   * @return Record<string, string> or null if not found
   */
  public async getSlugsById(id: TagId): Promise<Record<string, string> | null> {
    const tag = this.tags.find((tag) => tag.id === id.value)

    if (!tag) {
      return null
    }

    return tag.slugs as Record<string, string>
  }
}
