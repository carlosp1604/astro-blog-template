import { Slug } from '@/modules/Shared/Domain/ValueObject/SlugValueObject.ts'
import { CategoryDomainException } from '@/modules/Category/Domain/CategoryDomainException.ts'

export class CategorySlug extends Slug {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidSlug(normalized)) {
      throw CategoryDomainException.invalidSlug()
    }
  }

  static fromString(value: string): CategorySlug {
    return new CategorySlug(value)
  }
}
