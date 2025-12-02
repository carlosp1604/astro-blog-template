import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { CategorySlug } from '@/modules/Category/Domain/ValueObject/CategorySlug.ts'
import { CategoryDomainException } from '@/modules/Category/Domain/CategoryDomainException.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import {
  GetCategoryBySlugApplicationError
} from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlugApplicationError.ts'
import {
  CategoryWithParentAndChildrenApplicationDtoTranslator
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDtoTranslator.ts'
import type {
  GetCategoryBySlugApplicationRequestDto
} from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlugApplicationRequestDto.ts'
import type {
  CategoryWithParentAndChildrenApplicationDto
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDto.ts'

export class GetCategoryBySlug {
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetCategoryBySlugApplicationRequestDto
  ): Promise<Result<CategoryWithParentAndChildrenApplicationDto, GetCategoryBySlugApplicationError>> {
    const validateSlugResult = this.validateSlug(request.slug)

    if (!validateSlugResult.success) {
      return validateSlugResult
    }

    const slug = validateSlugResult.value

    const getCategoryResult = await this.getCategory(slug, request.locale)

    if (!getCategoryResult.success) {
      return getCategoryResult
    }

    const category = getCategoryResult.value

    return success(CategoryWithParentAndChildrenApplicationDtoTranslator.fromDomain(category))
  }

  private validateSlug (slug: string): Result<CategorySlug, GetCategoryBySlugApplicationError> {
    try {
      const validSlug = CategorySlug.fromString(slug)

      return success(validSlug)
    } catch (exception: unknown) {
      const safeCategorySlug = slug.slice(0, 128)

      if (!(exception instanceof CategoryDomainException) || exception.id !== CategoryDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error during Category Slug validation', trace, {
          slugSample: safeCategorySlug,
          slugLength: slug.length,
          error: exception
        })

        return fail(GetCategoryBySlugApplicationError.internalError(safeCategorySlug))
      }

      this.loggerService.warn('Validation failed for Category Slug', {
        slugSample: safeCategorySlug,
        slugLength: slug.length
      })

      return fail(GetCategoryBySlugApplicationError.invalidCategorySlug(exception.message))
    }
  }

  private async getCategory(slug: CategorySlug, locale: string): Promise<Result<Category, GetCategoryBySlugApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)

    try {
      const category = await this.categoryRepository.getCategoryBySlug(slug, validLocale)

      if (!category) {
        return fail(GetCategoryBySlugApplicationError.notFound(slug.toString()))
      }

      return success(category)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving category with slug ${slug.toString()}`, trace, {
        slug: slug.toString(),
        locale: locale.slice(0, 32),
        error: exception
      })

      return fail(GetCategoryBySlugApplicationError.internalError(slug.toString()))
    }
  }
}
