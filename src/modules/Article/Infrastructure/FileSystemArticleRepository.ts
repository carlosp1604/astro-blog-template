import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { asSafeLocale } from '@/modules/Shared/Infrastructure/SafeLocale.ts'
import { ArticleModelTranslator } from '@/modules/Article/Infrastructure/ArticleModelTranslator.ts'
import type Fuse from 'fuse.js'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticleId } from '@/modules/Article/Domain/ValueObject/ArticleId.ts'
import type { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'
import type { TagRawModel } from '@/modules/Tag/Infrastructure/TagRawModel.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'
import type { TagJsonModel } from '@/modules/Tag/Infrastructure/TagJsonModel.ts'
import type { ArticleRawModel } from '@/modules/Article/Infrastructure/ArticleRawModel.ts'
import type { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import type { ArticleJsonModel } from '@/modules/Article/Infrastructure/ArticleJsonModel.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import type { CategoryJsonModel } from '@/modules/Category/Infrastructure/CategoryJsonModel.ts'
import type {
  ArticleRepositoryInterface
} from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'

export class FileSystemArticleRepository implements ArticleRepositoryInterface {
  constructor(
    private readonly articles: Array<ArticleJsonModel>,
    private readonly categories: Array<CategoryJsonModel>,
    private readonly tags: Array<TagJsonModel>,
    private readonly articlesFuse: Fuse<ArticleJsonModel>
  ) {}

  /**
    * Get an Article (with categories and tags) given one of its slugs
    * @param slug Article slug
    * @param locale Language in which Article entity must be translated
    * @return Article if found or null
    */
  public async getArticleBySlug(slug: ArticleSlug, locale: Locale): Promise<Article | null> {
    const article = this.articles.find((article) => {
      if (article.slug !== slug.value) {
        return false
      }

      return article.locale === locale.value
    })

    if (!article) {
      return null
    }

    const articleCategories = this.categories.filter((category) => {
      return article.categories.includes(category.id)
    })
    const articleTags = this.tags.filter((tag) => {
      return article.tags.includes(tag.id)
    })

    const safeLocale = asSafeLocale(locale.value)

    const processedCategories: Array<CategoryRawModel> = articleCategories
      .filter((category) => category.slugs[safeLocale])
      .map((category) => {
        return {
          id: category.id,
          name: category.translations[safeLocale].name,
          description: category.translations[safeLocale].description,
          imageAltTitle: category.imageAltTitle[safeLocale],
          articlesCount: 0,
          slug: category.slugs[safeLocale],
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          parentCategory: undefined,
          childCategories: undefined
        }
      })

    const processedTags: Array<TagRawModel> = articleTags
      .filter((tag) => tag.slugs[safeLocale])
      .map((tag) => ({
        id: tag.id,
        slug: tag.slugs[safeLocale],
        articlesCount: 0,
        name: tag.translations[safeLocale].name
      }))

    const rawArticle: ArticleRawModel = {
      ...article,
      categories: processedCategories,
      tags: processedTags
    }

    return ArticleModelTranslator.toDomain(rawArticle, [ 'categories', 'tags' ])
  }

  /**
    * Get a list of articles given a criteria
    * @param criteria Articles Criteria
    * @return ArticlesPage
    */
  public async getArticles(criteria: ArticlesCriteria): Promise<ArticlesPage> {
    const { pagination: { offset, limit }, sort, categoryId, tagId, locale, title } = criteria

    let baseArticles: Array<ArticleJsonModel>

    if (title) {
      baseArticles = this.articlesFuse.search(title).map((result) => result.item)
    } else {
      baseArticles = this.articles
    }

    const localizedArticles = baseArticles.filter(
      (article) => article.locale === locale.value && article.status === 'published'
    )

    let filteredArticles = [ ...localizedArticles ]

    if (categoryId) {
      filteredArticles = filteredArticles.filter((article) =>
        article.categories.includes(categoryId.value))
    }

    if (tagId) {
      filteredArticles = filteredArticles.filter((article) =>
        article.tags.includes(tagId.value))
    }

    const sortedArticles = [ ...filteredArticles ]

    if (sort.by === 'date') {
      sortedArticles.sort((a, b) => {
        const bDate = new Date(b.publishedAt)
        const aDate = new Date(a.publishedAt)

        return bDate.getTime() - aDate.getTime()
      })
    } else if (!title) {
      sortedArticles.sort((a, b) => b.relevance - a.relevance)
    }

    const page = sortedArticles.slice(offset, offset + limit)

    const processedPage: Array<ArticleRawModel> = page.map((article) => ({
      ...article,
      categories: undefined,
      tags: undefined,
      body: undefined
    }))

    const totalItems = filteredArticles.length
    const pageNumber = Math.floor(offset / limit) + 1
    const pageCount = Math.max(1, Math.ceil(totalItems / limit))
    const hasNext = offset + limit < totalItems
    const hasPrev = offset > 0

    return {
      items: processedPage.map((rawArticle) =>
        ArticleModelTranslator.toDomain(rawArticle, [])),
      hasNext,
      hasPrev,
      pageCount,
      page: pageNumber,
      pageSize: limit,
      totalItems: totalItems
    }
  }

  /**
   * Get the featured articles given a locale
   * @param locale Language in which Article entities must be translated
   * @return Array of Article
   */
  public async getFeaturedArticles(locale: Locale): Promise<Array<Article>> {
    const localizedArticles = this.articles.filter(
      (article) => article.locale === locale.value && article.status === 'published'
    )

    const featuredArticles = localizedArticles.filter((article) => article.isFeatured)

    return featuredArticles.map((article) => ArticleModelTranslator.toDomain({
      ...article,
      categories: undefined,
      tags: undefined
    }, []))
  }

  /**
    * Get all slugs from an Article given its ID
    * @param id Article ID
    * @return Record<string, string> or null if not found
    */
  public async getSlugsById(id: ArticleId): Promise<Record<string, string> | null> {
    const article = this.articles.find((article) => article.id === id.value)

    if (!article) {
      return null
    }

    return article.slugs
  }
}
