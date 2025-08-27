import type { Locale } from '@/config/i18n.config.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'

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
}