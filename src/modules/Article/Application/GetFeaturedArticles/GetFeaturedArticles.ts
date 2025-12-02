import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { ArticleApplicationDtoTranslator } from '@/modules/Article/Application/ArticleApplicationDtoTranslator.ts'
import {
  GetFeaturedArticlesApplicationError
} from '@/modules/Article/Application/GetFeaturedArticles/GetFeaturedArticlesApplicationError.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticleApplicationDto } from '@/modules/Article/Application/ArticleApplicationDto.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type {
  GetFeaturedArticlesApplicationRequestDto
} from '@/modules/Article/Application/GetFeaturedArticles/GetFeaturedArticlesApplicationRequestDto.ts'

export class GetFeaturedArticles {
  constructor(
    private readonly articleRepository: ArticleRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetFeaturedArticlesApplicationRequestDto
  ): Promise<Result<Array<ArticleApplicationDto>, GetFeaturedArticlesApplicationError>> {
    const getFeaturedArticlesResult = await this.getFeaturedArticles(request.locale)

    if (!getFeaturedArticlesResult.success) {
      return getFeaturedArticlesResult
    }

    const featuredArticles = getFeaturedArticlesResult.value

    return success(featuredArticles.map((article) => ArticleApplicationDtoTranslator.fromDomain(article)))
  }

  private async getFeaturedArticles(locale: string): Promise<Result<Array<Article>, GetFeaturedArticlesApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)

    try {
      const articles = await this.articleRepository.getFeaturedArticles(validLocale)

      return success(articles)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error('Unexpected error while retrieving featured articles', trace, {
        locale: locale.slice(0, 32),
        error: exception
      })

      return fail(GetFeaturedArticlesApplicationError.internalError())
    }
  }
}
