import { Id } from '@/modules/Shared/Domain/ValueObject/IdValueObject.ts'
import { TagDomainException } from '@/modules/Tag/Domain/TagDomainException.ts'

export class TagId extends Id {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidId(normalized)) {
      throw TagDomainException.invalidId()
    }
  }

  static fromString(value: string): TagId {
    return new TagId(value)
  }
}
