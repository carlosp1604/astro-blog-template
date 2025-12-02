import { DomainException } from '@/modules/Exceptions/Domain/DomainException.ts'

export class TagDomainException extends DomainException {
  private _brand!: void

  public static invalidIdId = 'tag_invalid_id'
  public static invalidIdSlugId = 'tag_invalid_slug'

  constructor(message: string, id: string) {
    super(message, id, TagDomainException.name)

    Object.setPrototypeOf(this, TagDomainException.prototype)
  }

  public static invalidId (): TagDomainException {
    return new TagDomainException('Invalid Tag ID', this.invalidIdId)
  }

  public static invalidSlug (): TagDomainException {
    return new TagDomainException('Invalid Tag slug', this.invalidIdSlugId)
  }
}
