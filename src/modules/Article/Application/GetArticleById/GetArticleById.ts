import { i18nConfig } from '@/config/i18n.config.ts'
import type { ArticleWithCategoriesAndBodyApplicationDto } from '@/modules/Article/Application/ArticleWithCategoriesAndBodyApplicationDto.ts'
import { ArticleWithCategoriesAndBodyApplicationDtoTranslator } from '@/modules/Article/Application/ArticleWithCategoriesAndBodyApplicationDtoTranslator.ts'
import {
  GetArticleByIdApplicationError
} from '@/modules/Article/Application/GetArticleById/GetArticleByIdApplicationError.ts'
import type {
  GetArticleByIdApplicationRequestDto
} from '@/modules/Article/Application/GetArticleById/GetArticleByIdApplicationRequestDto.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Result } from '@/modules/Shared/Domain/Result.ts'

export class GetArticleById {
  constructor(private articleRepository: ArticleRepositoryInterface) {
  }

  public async get(
    request: GetArticleByIdApplicationRequestDto
  ): Promise<Result<ArticleWithCategoriesAndBodyApplicationDto, GetArticleByIdApplicationError>> {
    const article = await this.articleRepository.getArticleBySlug(request.articleId, Locale.create(
      request.locale, [ ...i18nConfig.locales ], i18nConfig.defaultLocale
    ))

    if (!article) {
      return {
        success: false,
        error: GetArticleByIdApplicationError.notFound(request.articleId)
      }
    }

    return {
      success: true,
      value: ArticleWithCategoriesAndBodyApplicationDtoTranslator.fromDomain(article)
    }
  }
}