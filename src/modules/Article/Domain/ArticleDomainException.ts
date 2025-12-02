import { DomainException } from '@/modules/Exceptions/Domain/DomainException.ts'

export class ArticleDomainException extends DomainException {
  private _brand!: void

  public static invalidIdId = 'article_invalid_id'
  public static invalidIdSlugId = 'article_invalid_slug'

  constructor(message: string, id: string) {
    super(message, id, ArticleDomainException.name)

    Object.setPrototypeOf(this, ArticleDomainException.prototype)
  }

  public static invalidId (): ArticleDomainException {
    return new ArticleDomainException('Invalid Article ID', this.invalidIdId)
  }

  public static invalidSlug (): ArticleDomainException {
    return new ArticleDomainException('Invalid Article slug', this.invalidIdSlugId)
  }
}
