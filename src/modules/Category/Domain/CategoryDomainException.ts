import { DomainException } from '@/modules/Exceptions/Domain/DomainException.ts'

export class CategoryDomainException extends DomainException {
  private _brand!: void

  public static invalidIdId = 'category_invalid_id'
  public static invalidIdSlugId = 'category_invalid_slug'

  constructor(message: string, id: string) {
    super(message, id, CategoryDomainException.name)

    Object.setPrototypeOf(this, CategoryDomainException.prototype)
  }

  public static invalidId (): CategoryDomainException {
    return new CategoryDomainException('Invalid Category ID', this.invalidIdId)
  }

  public static invalidSlug (): CategoryDomainException {
    return new CategoryDomainException('Invalid Category slug', this.invalidIdSlugId)
  }
}
