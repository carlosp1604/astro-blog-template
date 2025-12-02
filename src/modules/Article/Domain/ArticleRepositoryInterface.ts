import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticleId } from '@/modules/Article/Domain/ValueObject/ArticleId.ts'
import type { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'
import type { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'

export type ArticleRepositoryRelationshipsOptions = 'categories' | 'tags'

export interface ArticleRepositoryInterface {
  /**
    * Get an Article (with categories and tags) given one of its slugs
    * @param slug Article slug
    * @param locale Language in which Article entity must be translated
    * @return Article if found or null
    */
  getArticleBySlug(slug: ArticleSlug, locale: Locale): Promise<Article | null>

  /**
    * Get a list of articles given a criteria
    * @param criteria Articles Criteria
    * @return ArticlesPage
    */
  getArticles(criteria: ArticlesCriteria): Promise<ArticlesPage>

  /**
   * Get the featured articles given a locale
   * @param locale Language in which Article entities must be translated
   * @return Array of Article
   */
  getFeaturedArticles(locale: Locale): Promise<Array<Article>>

  /**
    * Get all slugs from an Article given its ID
    * @param id Article ID
    * @return Record<string, string> or null if not found
    */
  getSlugsById(id: ArticleId): Promise<Record<string, string> | null>
}
