import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { GetCategoriesApplicationError } from '@/modules/Category/Application/GetCategories/GetCategoriesApplicationError.ts'
import { CategoryApplicationDtoTranslator } from '@/modules/Category/Application/CategoryApplicationDtoTranslator.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { CategoryApplicationDto } from '@/modules/Category/Application/CategoryApplicationDto.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import type {
  GetCategoriesApplicationRequestDto
} from '@/modules/Category/Application/GetCategories/GetCategoriesApplicationRequestDto.ts'

export class GetCategories {
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetCategoriesApplicationRequestDto
  ): Promise<Result<Array<CategoryApplicationDto>, GetCategoriesApplicationError>> {
    const getCategoriesResult = await this.getCategories(request.locale)

    if (!getCategoriesResult.success) {
      return getCategoriesResult
    }

    const categories = getCategoriesResult.value

    return success(categories.map((category) => CategoryApplicationDtoTranslator.fromDomain(category)))
  }

  private async getCategories(locale: string): Promise<Result<Array<Category>, GetCategoriesApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)

    try {
      const categories = await this.categoryRepository.getAllCategories(validLocale)

      return success(categories)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error('Unexpected error while retrieving categories', trace, {
        locale: locale.slice(0, 32),
        error: exception
      })

      return fail(GetCategoriesApplicationError.internalError())
    }
  }
}
