import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagApplicationDto } from '@/modules/Tag/Application/TagApplicationDto.ts'

export class TagApplicationDtoTranslator {
  public static fromDomain(domain: Tag): TagApplicationDto {
    return {
      id: domain.id,
      slug: domain.slug,
      name: domain.name,
      articlesCount: domain.articlesCount
    }
  }
}
