import {
  GetArticleSlugsByIdApplicationError
} from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsByIdApplicationError.ts'
import type {
  GetArticleSlugsByIdApplicationRequestDto
} from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsByIdApplicationRequestDto.ts'
import type { ArticleRepositoryInterface } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type { TranslatedSlugApplicationDto } from '@/modules/Shared/Application/TranslatedSlugApplicationDto.ts'
import type { Result } from '@/modules/Shared/Domain/Result.ts'

export class GetArticleSlugsById {
  constructor(private articleRepository: ArticleRepositoryInterface) {
  }

  public async get (
    request: GetArticleSlugsByIdApplicationRequestDto
  ): Promise<Result<TranslatedSlugApplicationDto, GetArticleSlugsByIdApplicationError>> {
    const slugs = await this.articleRepository.getSlugsById(request.id)

    if (!slugs) {
      return {
        success: false,
        error: GetArticleSlugsByIdApplicationError.notFound(request.id)
      }
    }

    return {
      success: true,
      value: slugs
    }
  }
}