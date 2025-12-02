import { Id } from '@/modules/Shared/Domain/ValueObject/IdValueObject.ts'
import { CategoryDomainException } from '@/modules/Category/Domain/CategoryDomainException.ts'

export class CategoryId extends Id {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidId(normalized)) {
      throw CategoryDomainException.invalidId()
    }
  }

  static fromString(value: string): CategoryId {
    return new CategoryId(value)
  }
}
