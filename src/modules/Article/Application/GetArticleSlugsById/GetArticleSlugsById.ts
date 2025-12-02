import {
  GetArticleSlugsByIdApplicationError
} from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsByIdApplicationError.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type { TranslatedSlugApplicationDto } from '@/modules/Shared/Application/TranslatedSlugApplicationDto.ts'
import type {
  GetArticleSlugsByIdApplicationRequestDto
} from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsByIdApplicationRequestDto.ts'
import { ArticleId } from '@/modules/Article/Domain/ValueObject/ArticleId.ts'
import { ArticleDomainException } from '@/modules/Article/Domain/ArticleDomainException.ts'

export class GetArticleSlugsById {
  constructor(
    private readonly articleRepository: ArticleRepositoryInterface,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get (
    request: GetArticleSlugsByIdApplicationRequestDto
  ): Promise<Result<TranslatedSlugApplicationDto, GetArticleSlugsByIdApplicationError>> {
    const validateArticleIdResult = this.validateArticleId(request.id)

    if (!validateArticleIdResult.success) {
      return validateArticleIdResult
    }

    const articleId = validateArticleIdResult.value

    const getSlugsResult = await this.getSlugs(articleId)

    if (!getSlugsResult.success) {
      return getSlugsResult
    }

    const slugs = getSlugsResult.value

    return success(slugs)
  }

  private validateArticleId (articleId: string): Result<ArticleId, GetArticleSlugsByIdApplicationError> {
    try {
      const validArticleId = ArticleId.fromString(articleId)

      return success(validArticleId)
    } catch (exception: unknown) {
      const safeArticleId = articleId.slice(0, 36)

      if (!(exception instanceof ArticleDomainException) || exception.id !== ArticleDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error during Article ID validation', trace, {
          idSample: safeArticleId,
          idLength: articleId.length,
          error: exception
        })

        return fail(GetArticleSlugsByIdApplicationError.internalError(safeArticleId))
      }

      this.loggerService.warn('Validation failed for Article ID', {
        idSample: safeArticleId,
        idLength: articleId.length
      })

      return fail(GetArticleSlugsByIdApplicationError.invalidArticleId(exception.message))
    }
  }

  private async getSlugs(articleId: ArticleId): Promise<Result<Record<string, string>, GetArticleSlugsByIdApplicationError>> {
    try {
      const slugs = await this.articleRepository.getSlugsById(articleId)

      if (!slugs) {
        return fail(GetArticleSlugsByIdApplicationError.internalError(articleId.toString()))
      }

      return success(slugs)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving slugs for article with ID ${articleId.toString()}`, trace, {
        articleId: articleId.toString(),
        error: exception
      })

      return fail(GetArticleSlugsByIdApplicationError.notFound(articleId.toString()))
    }
  }
}
