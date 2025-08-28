import { i18nConfig } from '@/config/i18n.config.ts'
import type { CategoryApplicationDto } from '@/modules/Category/Application/CategoryApplicationDto.ts'
import { CategoryApplicationDtoTranslator } from '@/modules/Category/Application/CategoryApplicationDtoTranslator.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'

export class GetCategories {
  constructor(private categoryRepository: CategoryRepositoryInterface) {
  }

  public async get(locale: string): Promise<Array<CategoryApplicationDto>> {
    const categories = await this.categoryRepository.getAllCategories(Locale.create(
      locale, [ ...i18nConfig.locales ], i18nConfig.defaultLocale
    ))

    return categories.map((category) => CategoryApplicationDtoTranslator.fromDomain(category))
  }
}