import { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'
import { CategoryDomainException } from '@/modules/Category/Domain/CategoryDomainException.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import type { TranslatedSlugApplicationDto } from '@/modules/Shared/Application/TranslatedSlugApplicationDto.ts'
import {
  GetCategorySlugsByIdApplicationError
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationError.ts'
import type {
  GetCategorySlugsByIdApplicationRequestDto
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationRequestDto.ts'

export class GetCategorySlugsById {
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get (
    request: GetCategorySlugsByIdApplicationRequestDto
  ): Promise<Result<TranslatedSlugApplicationDto, GetCategorySlugsByIdApplicationError>> {
    const validateCategoryIdResult = this.validateCategoryId(request.id)

    if (!validateCategoryIdResult.success) {
      return validateCategoryIdResult
    }

    const categoryId = validateCategoryIdResult.value

    const getSlugsResult = await this.getSlugs(categoryId)

    if (!getSlugsResult.success) {
      return getSlugsResult
    }

    const slugs = getSlugsResult.value

    return success(slugs)
  }

  private validateCategoryId (categoryId: string): Result<CategoryId, GetCategorySlugsByIdApplicationError> {
    try {
      const validCategoryId = CategoryId.fromString(categoryId)

      return success(validCategoryId)
    } catch (exception: unknown) {
      const safeCategoryId = categoryId.slice(0, 36)

      if (!(exception instanceof CategoryDomainException) || exception.id !== CategoryDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error during Category ID validation', trace, {
          idSample: safeCategoryId,
          idLength: safeCategoryId.length,
          error: exception
        })

        return fail(GetCategorySlugsByIdApplicationError.internalError(safeCategoryId))
      }

      this.loggerService.warn('Validation failed for Category ID', {
        idSample: safeCategoryId,
        idLength: safeCategoryId.length
      })

      return fail(GetCategorySlugsByIdApplicationError.invalidCategoryId(exception.message))
    }
  }

  private async getSlugs(categoryId: CategoryId): Promise<Result<Record<string, string>, GetCategorySlugsByIdApplicationError>> {
    try {
      const slugs = await this.categoryRepository.getSlugsById(categoryId)

      if (!slugs) {
        return fail(GetCategorySlugsByIdApplicationError.internalError(categoryId.toString()))
      }

      return success(slugs)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving slugs for category with ID ${categoryId.toString()}`, trace, {
        categoryId: categoryId.toString(),
        error: exception
      })

      return fail(GetCategorySlugsByIdApplicationError.notFound(categoryId.toString()))
    }
  }
}
