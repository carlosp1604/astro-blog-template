import {
  GetCategorySlugsByIdApplicationError
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationError.ts'
import type {
  GetCategorySlugsByIdApplicationRequestDto
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationRequestDto.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import type { TranslatedSlugApplicationDto } from '@/modules/Shared/Application/TranslatedSlugApplicationDto.ts'
import type { Result } from '@/modules/Shared/Domain/Result.ts'

export class GetCategorySlugsById {
  constructor(private categoryRepository: CategoryRepositoryInterface) {
  }

  public async get (
    request: GetCategorySlugsByIdApplicationRequestDto
  ): Promise<Result<TranslatedSlugApplicationDto, GetCategorySlugsByIdApplicationError>> {
    const slugs = await this.categoryRepository.getSlugsById(request.id)

    if (!slugs) {
      return {
        success: false,
        error: GetCategorySlugsByIdApplicationError.notFound(request.id)
      }
    }

    return {
      success: true,
      value: slugs
    }
  }
}