import { Slug } from '@/modules/Shared/Domain/ValueObject/SlugValueObject.ts'
import { TagDomainException } from '@/modules/Tag/Domain/TagDomainException.ts'

export class TagSlug extends Slug {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidSlug(normalized)) {
      throw TagDomainException.invalidSlug()
    }
  }

  static fromString(value: string): TagSlug {
    return new TagSlug(value)
  }
}
