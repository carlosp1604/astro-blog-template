import type { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import type { TagSlug } from '@/modules/Tag/Domain/ValueObject/TagSlug.ts'

export class Tag {
  public readonly id: TagId
  public readonly slug: TagSlug
  public readonly name: string
  public readonly articlesCount: number

  constructor(
    id: TagId,
    slug: TagSlug,
    name: string,
    articlesCount: number
  ) {
    this.id = id
    this.slug = slug
    this.name = name
    this.articlesCount = articlesCount
  }
}
