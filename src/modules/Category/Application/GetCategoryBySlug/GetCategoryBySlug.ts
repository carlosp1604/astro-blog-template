import { i18nConfig } from '@/config/i18n.config.ts'
import type {
  CategoryWithParentAndChildrenApplicationDto
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDto.ts'
import {
  CategoryWithParentAndChildrenApplicationDtoTranslator
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDtoTranslator.ts'
import {
  GetCategoryBySlugApplicationError
} from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlugApplicationError.ts'
import type {
  GetCategoryBySlugApplicationRequestDto
} from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlugApplicationRequestDto.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Result } from '@/modules/Shared/Domain/Result.ts'

export class GetCategoryBySlug {
  constructor(private categoryRepository: CategoryRepositoryInterface) {
  }

  public async get(
    request: GetCategoryBySlugApplicationRequestDto
  ): Promise<Result<CategoryWithParentAndChildrenApplicationDto, GetCategoryBySlugApplicationError>> {
    const category = await this.categoryRepository.getCategoryBySlug(request.slug, Locale.create(
      request.locale, [ ...i18nConfig.locales ], i18nConfig.defaultLocale
    ))

    if (!category) {
      return {
        success: false,
        error: GetCategoryBySlugApplicationError.notFound(request.slug)
      }
    }

    return {
      success: true,
      value: CategoryWithParentAndChildrenApplicationDtoTranslator.fromDomain(category)
    }
  }
}