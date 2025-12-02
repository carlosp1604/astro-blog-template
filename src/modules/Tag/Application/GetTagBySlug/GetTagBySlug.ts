import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import { TagSlug } from '@/modules/Tag/Domain/ValueObject/TagSlug.ts'
import { TagDomainException } from '@/modules/Tag/Domain/TagDomainException.ts'
import { TagApplicationDtoTranslator } from '@/modules/Tag/Application/TagApplicationDtoTranslator.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagApplicationDto } from '@/modules/Tag/Application/TagApplicationDto.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TagRepositoryInterface } from '@/modules/Tag/Domain/TagRepositoryInterface.ts'
import type { TranslationsConfiguration } from '@/modules/Shared/Application/TranslationsConfiguration.ts'
import {
  GetTagBySlugApplicationError
} from '@/modules/Tag/Application/GetTagBySlug/GetTagBySlugApplicationError.ts'
import type {
  GetTagBySlugApplicationRequestDto
} from '@/modules/Tag/Application/GetTagBySlug/GetTagBySlugApplicationRequestDto.ts'

export class GetTagBySlug {
  constructor(
    private tagRepository: TagRepositoryInterface,
    private readonly translationsConfig: TranslationsConfiguration,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get(
    request: GetTagBySlugApplicationRequestDto
  ): Promise<Result<TagApplicationDto, GetTagBySlugApplicationError>> {
    const validateSlugResult = this.validateSlug(request.slug)

    if (!validateSlugResult.success) {
      return validateSlugResult
    }

    const slug = validateSlugResult.value

    const getTagResult = await this.getTag(slug, request.locale)

    if (!getTagResult.success) {
      return getTagResult
    }

    const tag = getTagResult.value

    return success(TagApplicationDtoTranslator.fromDomain(tag))
  }

  private validateSlug (slug: string): Result<TagSlug, GetTagBySlugApplicationError> {
    try {
      const validSlug = TagSlug.fromString(slug)

      return success(validSlug)
    } catch (exception: unknown) {
      const safeTagSlug = slug.slice(0, 128)

      if (!(exception instanceof TagDomainException) || exception.id !== TagDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error during Tag Slug validation', trace, {
          slugSample: safeTagSlug,
          slugLength: slug.length,
          error: exception
        })

        return fail(GetTagBySlugApplicationError.internalError(safeTagSlug))
      }

      this.loggerService.warn('Validation failed for Tag Slug', {
        slugSample: safeTagSlug,
        slugLength: slug.length
      })

      return fail(GetTagBySlugApplicationError.invalidTagSlug(exception.message))
    }
  }

  private async getTag(tagSlug: TagSlug, locale: string): Promise<Result<Tag, GetTagBySlugApplicationError>> {
    const validLocale = Locale.create(locale, this.translationsConfig.locales, this.translationsConfig.defaultLocale)

    try {
      const tag = await this.tagRepository.getTagBySlug(tagSlug, validLocale)

      if (!tag) {
        return fail(GetTagBySlugApplicationError.notFound(tagSlug.toString()))
      }

      return success(tag)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving tag with slug ${tagSlug.toString()}`, trace, {
        slug: tagSlug.toString(),
        locale: locale.slice(0, 32),
        error: exception
      })

      return fail(GetTagBySlugApplicationError.internalError(tagSlug.toString()))
    }
  }
}
