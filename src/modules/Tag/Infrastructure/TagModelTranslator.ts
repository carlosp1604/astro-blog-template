import { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagRawModel } from '@/modules/Tag/Infrastructure/TagRawModel.ts'

export class TagModelTranslator {
  public static toDomain(rawModel: TagRawModel): Tag {
    return new Tag(
      rawModel.id,
      rawModel.slug,
      rawModel.name,
      rawModel.articlesCount ? rawModel.articlesCount : 0
    )
  }
}
