import type { Locale } from '@/config/i18n.config.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type {
  ArticleRepositoryInterface
} from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'
import { ArticleModelTranslator } from '@/modules/Article/Infrastructure/ArticleModelTranslator.ts'
import type { ArticleRawModel } from '@/modules/Article/Infrastructure/ArticleRawModel.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import articles from '~/data/articles.json'
import categories from '~/data/categories.json'

export class FileSystemArticleRepository implements ArticleRepositoryInterface {
  /**
    * Get an Article (with categories and body) given one of its slugs
    * @param slug Article slug
    * @param locale Language in which Article entity must be translated
    * @return Article if found or null
    */
  public async getArticleBySlug(slug: string, locale: Locale): Promise<Article | null> {
    const article = articles.find((article) => {

      if (article.slug !== slug) {
        return false
      }

      return article.locale === locale
    })

    if (!article) {
      return null
    }

    const articleCategories = categories.filter((category) => {
      return article.categories.includes(category.id)
    })

    const processedCategories: Array<CategoryRawModel> = articleCategories
      .filter((category) => category.slugs[locale])
      .map((category) => {

        return {
          id: category.id,
          name: category.translations[locale].name,
          description: category.translations[locale].description,
          imageAltTitle: category.imageAltTitle[locale],
          postCount: 0,
          slug: category.slugs[locale],
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          parentCategory: undefined,
          childCategories: undefined,
        }
      })

    // TODO: Load body
    // read body and set to article
    // const body = readBody(article.path)

    const rawArticle: ArticleRawModel = {
      ...article,
      categories: processedCategories,
      body: '' // article.body = body
    }

    return ArticleModelTranslator.toDomain(rawArticle, [ 'categories' ])
  }

  /**
    * Get a list of articles given a criteria
    * @param criteria Articles Criteria
    * @return ArticlesPage
    */
  public async getArticles(criteria: ArticlesCriteria): Promise<ArticlesPage> {
    const { pagination: { offset, limit }, sort, categoryId, locale } = criteria

    const localizedArticles = articles.filter(
      (article) => article.locale === locale.value)

    let filteredArticles = [ ...localizedArticles ]

    if (categoryId) {
      filteredArticles = filteredArticles.filter((article) =>
        article.categories.includes(categoryId)
      )
    }

    const sortedArticles = [ ...filteredArticles ]

    if (sort.by === 'date') {
      sortedArticles.sort((a, b) => {
        const bDate = new Date(b.publishedAt)
        const aDate = new Date(a.publishedAt)

        return bDate.getTime() - aDate.getTime()
      })
    } else {
      sortedArticles.sort((a, b) => b.relevance - a.relevance)
    }

    const page = sortedArticles.slice(offset, offset + limit)

    const processedPage: Array<ArticleRawModel> = page.map((article) => ({
      ...article,
      categories: undefined,
      body: undefined
    }))

    const pageNumber = Math.floor(offset / limit) + 1
    const pageCount = Math.max(1, Math.ceil(filteredArticles.length / limit))
    const hasNext = offset + limit < filteredArticles.length
    const hasPrev = offset > 0

    return {
      items: processedPage.map((rawArticle) => ArticleModelTranslator.toDomain(rawArticle, [])),
      hasNext,
      hasPrev,
      pageCount,
      page: pageNumber,
      pageSize: limit,
      totalItems: filteredArticles.length,
    }
  }
}