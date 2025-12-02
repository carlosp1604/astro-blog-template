import { Slug } from '@/modules/Shared/Domain/ValueObject/SlugValueObject.ts'
import { ArticleDomainException } from '@/modules/Article/Domain/ArticleDomainException.ts'

export class ArticleSlug extends Slug {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidSlug(normalized)) {
      throw ArticleDomainException.invalidSlug()
    }
  }

  static fromString(value: string): ArticleSlug {
    return new ArticleSlug(value)
  }
}
