import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'
import { ArticlesCriteria } from '@/modules/Article/Domain/ArticlesCriteria.ts'
import { CategoryDomainException } from '@/modules/Category/Domain/CategoryDomainException.ts'
import { GetArticlesApplicationError } from '@/modules/Article/Application/GetArticles/GetArticlesApplicationError.ts'
import { ArticleApplicationDtoTranslator } from '@/modules/Article/Application/ArticleApplicationDtoTranslator.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { ArticlesPage } from '@/modules/Article/Domain/ArticlesPage.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { PaginationConfiguration } from '@/modules/Shared/Application/PaginationConfiguration.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type {
  GetArticlesApplicationRequestDto
} from '@/modules/Article/Application/GetArticles/GetArticlesApplicationRequestDto.ts'
import type {
  GetArticlesApplicationResponseDto
} from '@/modules/Article/Application/GetArticles/GetArticlesApplicationResponseDto.ts'
import { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import { TagDomainException } from '@/modules/Tag/Domain/TagDomainException.ts'

export class GetArticles {
  constructor(
    private readonly articleRepository: ArticleRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly paginationConfig: PaginationConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetArticlesApplicationRequestDto
  ): Promise<Result<GetArticlesApplicationResponseDto, GetArticlesApplicationError>> {
    const articlesCriteria = this.buildCriteria(request)

    const getArticlesPageResult = await this.getArticlesPage(articlesCriteria, request)

    if (!getArticlesPageResult.success) {
      return getArticlesPageResult
    }

    const articlesPage = getArticlesPageResult.value

    return {
      success: true,
      value: {
        articles: articlesPage.items.map((article) => ArticleApplicationDtoTranslator.fromDomain(article)),
        hasNext: articlesPage.hasNext,
        page: articlesPage.page,
        pageSize: articlesPage.pageSize,
        hasPrev: articlesPage.hasPrev,
        pageCount: articlesPage.pageCount,
        totalItems: articlesPage.totalItems,
        criteria: {
          locale: articlesCriteria.locale.value,
          sortBy: articlesCriteria.sort.by,
          sortOrder: articlesCriteria.sort.order,
          categoryId: articlesCriteria.categoryId? articlesCriteria.categoryId.toString() : undefined,
          title: articlesCriteria.title
        }
      }
    }
  }

  private buildCriteria (request: GetArticlesApplicationRequestDto): ArticlesCriteria {
    const validCategoryId = request.filters.categoryId
      ? this.validateCategoryId(request.filters.categoryId)
      : undefined

    const validTagId = request.filters.tagId
      ? this.validateTagId(request.filters.tagId)
      : undefined

    return ArticlesCriteria.create(
      {
        page: request.pageNumber,
        size: request.pageSize,
        maxPageNumber: this.paginationConfig.maxPageNumber,
        minPageNumber: this.paginationConfig.minPageNumber,
        maxPageSize: this.paginationConfig.maxPageSize,
        minPageSize: this.paginationConfig.minPageSize,
        locale: Locale.create(request.locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale),
        categoryId: validCategoryId,
        tagId: validTagId,
        title: request.filters.title,
        sortBy: request.sortOption,
        sortOrder: request.sortOrder
      }
    )
  }

  private validateCategoryId (categoryId: string): CategoryId | undefined {
    try {
      return CategoryId.fromString(categoryId)
    } catch (exception: unknown) {
      const safeCategoryId = categoryId.slice(0, 36)

      if (!(exception instanceof CategoryDomainException) || exception.id !== CategoryDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('Unexpected error during Category ID validation', trace, {
          idSample: safeCategoryId,
          idLength: categoryId.length,
          error: exception
        })

        return undefined
      }

      this.loggerService.warn('Validation failed for Category ID', {
        idSample: safeCategoryId,
        idLength: categoryId.length
      })

      return undefined
    }
  }

  private validateTagId (tagId: string): TagId | undefined {
    try {
      return TagId.fromString(tagId)
    } catch (exception: unknown) {
      const safeTagId = tagId.slice(0, 36)

      if (!(exception instanceof TagDomainException) || exception.id !== TagDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('Unexpected error during Tag ID validation', trace, {
          idSample: safeTagId,
          idLength: tagId.length,
          error: exception
        })

        return undefined
      }

      this.loggerService.warn('Validation failed for Tag ID', {
        idSample: safeTagId,
        idLength: tagId.length
      })

      return undefined
    }
  }

  private async getArticlesPage(
    criteria: ArticlesCriteria,
    request: GetArticlesApplicationRequestDto
  ): Promise<Result<ArticlesPage, GetArticlesApplicationError>> {
    try {
      const articlesPage = await this.articleRepository.getArticles(criteria)

      return success(articlesPage)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error('Unexpected error while retrieving articles page', trace, {
        page: String(request.pageNumber).slice(0, 32),
        pageSize: String(request.pageSize).slice(0, 32),
        locale: request.locale.slice(0, 32),
        sortOption: request.sortOption.slice(0, 32),
        sortOrder: request.sortOrder.slice(0, 32),
        categoryId: request.filters.categoryId ? request.filters.categoryId.slice(0, 36) : request.filters.categoryId,
        title: request.filters.title ? request.filters.title.slice(0, 512) : request.filters.title,
        tagId: request.filters.tagId ? request.filters.tagId.slice(0, 36) : request.filters.tagId,
        error: exception
      })

      return fail(GetArticlesApplicationError.internalError())
    }
  }
}
