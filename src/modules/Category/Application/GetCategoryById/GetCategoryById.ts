import { i18nConfig } from '@/config/i18n.config.ts'
import type {
  CategoryWithParentAndChildrenApplicationDto
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDto.ts'
import {
  CategoryWithParentAndChildrenApplicationDtoTranslator
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDtoTranslator.ts'
import {
  GetCategoryByIdApplicationError
} from '@/modules/Category/Application/GetCategoryById/GetCategoryByIdApplicationError.ts'
import type {
  GetCategoryByIdApplicationRequestDto
} from '@/modules/Category/Application/GetCategoryById/GetCategoryByIdApplicationRequestDto.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Result } from '@/modules/Shared/Domain/Result.ts'

export class GetCategoryById {
  constructor(private categoryRepository: CategoryRepositoryInterface) {
  }

  public async get(
    request: GetCategoryByIdApplicationRequestDto
  ): Promise<Result<CategoryWithParentAndChildrenApplicationDto, GetCategoryByIdApplicationError>> {
    const category = await this.categoryRepository.getCategoryById(request.categoryId, Locale.create(
      request.locale, [ ...i18nConfig.locales ], i18nConfig.defaultLocale
    ))

    if (!category) {
      return {
        success: false,
        error: GetCategoryByIdApplicationError.notFound(request.categoryId)
      }
    }

    return {
      success: true,
      value: CategoryWithParentAndChildrenApplicationDtoTranslator.fromDomain(category)
    }
  }
}