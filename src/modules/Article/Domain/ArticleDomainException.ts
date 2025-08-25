import { DomainException } from '@/modules/Exceptions/Domain/DomainException.ts'

export class ArticleDomainException extends DomainException {
  public static bodyNotLoadedId = 'article_domain_body_not_loaded'

  public static bodyNotLoaded (id: string): ArticleDomainException {
    return new ArticleDomainException(
      `Body was not loaded for article with ID ${id}`,
      this.bodyNotLoadedId
    )
  }
}