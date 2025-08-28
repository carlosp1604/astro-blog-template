import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'
import { Locale, type LocaleCode } from '@/modules/Shared/Domain/LocaleValueObject.ts'

export type ArticleRepositoryRelationshipsOptions = 'categories'

export interface ArticleRepositoryInterface {
  /**
    * Get an Article (with categories and body) given one of its slugs
    * @param slug Article slug
    * @param locale Language in which Article entity must be translated
    * @return Article if found or null
    */
  getArticleBySlug(slug: string, locale: Locale): Promise<Article | null>

  /**
    * Get a list of articles given a criteria
    * @param criteria Articles Criteria
    * @return ArticlesPage
    */
  getArticles(criteria: ArticlesCriteria): Promise<ArticlesPage>

  /**
    * Get all slugs from an Article given its ID
    * @param id Article ID
    * @return Record<LocaleCode, string> or null if not found
    */
  getSlugsById(id: string): Promise<Record<LocaleCode, string> | null>
}