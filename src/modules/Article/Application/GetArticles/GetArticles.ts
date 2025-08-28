import { i18nConfig } from '@/config/i18n.config.ts'
import { ArticleApplicationDtoTranslator } from '@/modules/Article/Application/ArticleApplicationDtoTranslator.ts'
import type {
  GetArticlesApplicationRequestDto
} from '@/modules/Article/Application/GetArticles/GetArticlesApplicationRequestDto.ts'
import type {
  GetArticlesApplicationResponseDto
} from '@/modules/Article/Application/GetArticles/GetArticlesApplicationResponseDto.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'

export class GetArticles {
  constructor(
    private readonly articleRepository: ArticleRepositoryInterface,
    private readonly maxPageNumber: number,
    private readonly minPageNumber: number,
    private readonly maxPageSize: number,
    private readonly minPageSize: number
  ) {
  }

  public async get(request: GetArticlesApplicationRequestDto): Promise<GetArticlesApplicationResponseDto> {
    const articlesCriteria = ArticlesCriteria.create({
      page: request.pageNumber,
      size: request.pageSize,
      maxPageNumber: this.maxPageNumber,
      minPageNumber: this.minPageNumber,
      maxPageSize: this.maxPageSize,
      minPageSize: this.minPageSize,
      locale: Locale.create(
        request.locale, [ ...i18nConfig.locales ], i18nConfig.defaultLocale
      ),
      categoryId: request.categoryId,
      sortBy: request.sortOption,
      sortOrder: request.sortOrder,
    })

    const articlesPage = await this.articleRepository.getArticles(articlesCriteria)

    return {
      articles: articlesPage.items.map((article) => ArticleApplicationDtoTranslator.fromDomain(article)),
      hasNext: articlesPage.hasNext,
      page: articlesPage.page,
      pageSize: articlesPage.pageSize,
      hasPrev: articlesPage.hasPrev,
      pageCount: articlesPage.pageCount,
      totalItems: articlesPage.totalItems
    }
  }
}