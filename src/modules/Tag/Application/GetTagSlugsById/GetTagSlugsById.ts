import { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import { TagDomainException } from '@/modules/Tag/Domain/TagDomainException.ts'
import { GetTagSlugsByIdApplicationError } from '@/modules/Tag/Application/GetTagSlugsById/GetTagSlugsByIdApplicationError.ts'
import { fail, type Result, success } from '@/modules/Shared/Domain/Result.ts'
import type { LoggerServiceInterface } from '@/modules/Shared/Domain/LoggerServiceInterface.ts'
import type { TagRepositoryInterface } from '@/modules/Tag/Domain/TagRepositoryInterface.ts'
import type { TranslatedSlugApplicationDto } from '@/modules/Shared/Application/TranslatedSlugApplicationDto.ts'
import type {
  GetTagSlugsByIdApplicationRequestDto
} from '@/modules/Tag/Application/GetTagSlugsById/GetTagSlugsByIdApplicationRequestDto.ts'

export class GetTagSlugsById {
  constructor(
    private readonly tagRepository: TagRepositoryInterface,
    private readonly loggerService: LoggerServiceInterface
  ) {}

  public async get (
    request: GetTagSlugsByIdApplicationRequestDto
  ): Promise<Result<TranslatedSlugApplicationDto, GetTagSlugsByIdApplicationError>> {
    const validateTagIdResult = this.validateTagId(request.id)

    if (!validateTagIdResult.success) {
      return validateTagIdResult
    }

    const tagId = validateTagIdResult.value

    const getSlugsResult = await this.getSlugs(tagId)

    if (!getSlugsResult.success) {
      return getSlugsResult
    }

    const slugs = getSlugsResult.value

    return success(slugs)
  }

  private validateTagId (tagId: string): Result<TagId, GetTagSlugsByIdApplicationError> {
    try {
      const validTagId = TagId.fromString(tagId)

      return success(validTagId)
    } catch (exception: unknown) {
      const safeTagId = tagId.slice(0, 36)

      if (!(exception instanceof TagDomainException) || exception.id !== TagDomainException.invalidIdId) {
        const trace = exception instanceof Error ? exception.stack : undefined

        this.loggerService.error('CRITICAL: Unexpected error during Tag ID validation', trace, {
          idSample: safeTagId,
          idLength: safeTagId.length,
          error: exception
        })

        return fail(GetTagSlugsByIdApplicationError.internalError(safeTagId))
      }

      this.loggerService.warn('Validation failed for Tag ID', {
        idSample: safeTagId,
        idLength: safeTagId.length
      })

      return fail(GetTagSlugsByIdApplicationError.invalidTagId(exception.message))
    }
  }

  private async getSlugs(tagId: TagId): Promise<Result<Record<string, string>, GetTagSlugsByIdApplicationError>> {
    try {
      const slugs = await this.tagRepository.getSlugsById(tagId)

      if (!slugs) {
        return fail(GetTagSlugsByIdApplicationError.internalError(tagId.toString()))
      }

      return success(slugs)
    } catch (exception: unknown) {
      const trace = exception instanceof Error ? exception.stack : undefined

      this.loggerService.error(`Unexpected error while retrieving slugs for tag with ID ${tagId.toString()}`, trace, {
        tagId: tagId.toString(),
        error: exception
      })

      return fail(GetTagSlugsByIdApplicationError.notFound(tagId.toString()))
    }
  }
}
