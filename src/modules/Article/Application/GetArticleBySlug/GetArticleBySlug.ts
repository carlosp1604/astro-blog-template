import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'
import { ArticleDomainException } from '@/modules/Article/Domain/ArticleDomainException.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type { ArticleContentRepositoryInterface } from '@/modules/Article/Domain/ArticleContentRepositoryInterface.ts'
import {
  GetArticleBySlugApplicationError
} from '@/modules/Article/Application/GetArticleBySlug/GetArticleBySlugApplicationError.ts'
import {
  ArticleWithContentAndCategoriesAndTagsApplicationDtoTranslator
} from '@/modules/Article/Application/ArticleWithContentAndCategoriesAndTagsApplicationDtoTranslator.ts'
import type {
  ArticleWithContentAndCategoriesAndTagsApplicationDto
} from '@/modules/Article/Application/ArticleWithContentAndCategoriesAndTagsApplicationDto.ts'
import type {
  GetArticleBySlugApplicationRequestDto
} from '@/modules/Article/Application/GetArticleBySlug/GetArticleBySlugApplicationRequestDto.ts'

export class GetArticleBySlug {
  constructor(
    private readonly articleRepository: ArticleRepositoryInterface,
    private readonly articleContentRepository: ArticleContentRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetArticleBySlugApplicationRequestDto
  ): Promise<Result<ArticleWithContentAndCategoriesAndTagsApplicationDto, GetArticleBySlugApplicationError>> {
    const validateSlugResult = this.validateSlug(request.slug)

    if (!validateSlugResult.success) {
      return validateSlugResult
    }

    const slug = validateSlugResult.value

    const getArticleResult = await this.getArticle(slug, request.locale)

    if (!getArticleResult.success) {
      return getArticleResult
    }

    const article = getArticleResult.value

    const getArticleContentResult = await this.getArticleContent(slug, request.locale)

    if (!getArticleContentResult.success) {
      return getArticleContentResult
    }

    const articleContent = getArticleContentResult.value

    return success(ArticleWithContentAndCategoriesAndTagsApplicationDtoTranslator.fromDomain(article, articleContent))
  }

  private validateSlug (slug: string): Result<ArticleSlug, GetArticleBySlugApplicationError> {
    try {
      const validSlug = ArticleSlug.fromString(slug)

      return success(validSlug)
    } catch (exception: unknown) {
      const safeArticleSlug = slug.slice(0, 128)

      if (!(exception instanceof ArticleDomainException) || exception.id !== ArticleDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error while validating Article Slug', trace, {
          slugSample: safeArticleSlug,
          slugLength: slug.length,
          error: exception
        })

        return fail(GetArticleBySlugApplicationError.internalError(safeArticleSlug))
      }

      this.loggerService.warn('Validation failed for Article Slug', {
        slugSample: safeArticleSlug,
        slugLength: slug.length
      })

      return fail(GetArticleBySlugApplicationError.invalidArticleSlug(exception.message))
    }
  }

  private async getArticle (slug: ArticleSlug, locale: string): Promise<Result<Article, GetArticleBySlugApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)
    const safeLocale = locale.slice(0, 16)

    try {
      const article = await this.articleRepository.getArticleBySlug(slug, validLocale)

      if (!article) {
        return fail(GetArticleBySlugApplicationError.notFound(slug.toString()))
      }

      return success(article)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving article with slug ${slug.toString()}`, trace, {
        slug: slug.toString(),
        locale: safeLocale,
        error: exception
      })

      return fail(GetArticleBySlugApplicationError.internalError(slug.toString()))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getArticleContent (slug: ArticleSlug, locale: string): Promise<Result<any, GetArticleBySlugApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)
    const safeLocale = locale.slice(0, 16)

    try {
      const articleContent = await this.articleContentRepository.get(validLocale, slug)

      if (!articleContent) {
        return fail(GetArticleBySlugApplicationError.notFound(slug.toString()))
      }

      return success(articleContent)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving content from article with slug ${slug.toString()}`, trace, {
        slug: slug.toString(),
        locale: safeLocale,
        error: exception
      })

      return fail(GetArticleBySlugApplicationError.internalError(slug.toString()))
    }
  }
}
