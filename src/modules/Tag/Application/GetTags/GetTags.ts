import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { GetTagsApplicationError } from '@/modules/Tag/Application/GetTags/GetTagsApplicationError.ts'
import { TagApplicationDtoTranslator } from '@/modules/Tag/Application/TagApplicationDtoTranslator.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagApplicationDto } from '@/modules/Tag/Application/TagApplicationDto.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TagRepositoryInterface } from '@/modules/Tag/Domain/TagRepositoryInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import type { GetTagsApplicationRequestDto } from '@/modules/Tag/Application/GetTags/GetTagsApplicationRequestDto.ts'

export class GetTags {
  constructor(
    private readonly tagRepository: TagRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(request: GetTagsApplicationRequestDto): Promise<Result<Array<TagApplicationDto>, GetTagsApplicationError>> {
    const getTagsResult = await this.getTags(request.locale)

    if (!getTagsResult.success) {
      return getTagsResult
    }

    const tags = getTagsResult.value

    return success(tags.map((tag) => TagApplicationDtoTranslator.fromDomain(tag)))
  }

  private async getTags(locale: string): Promise<Result<Array<Tag>, GetTagsApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)

    try {
      const tags = await this.tagRepository.getAllTags(validLocale)

      return success(tags)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error('Unexpected error while retrieving tags', trace, {
        locale: locale.slice(0, 32),
        error: exception
      })

      return fail(GetTagsApplicationError.internalError())
    }
  }
}
