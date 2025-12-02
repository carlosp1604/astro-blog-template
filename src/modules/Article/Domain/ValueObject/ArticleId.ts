import { Id } from '@/modules/Shared/Domain/ValueObject/IdValueObject.ts'
import { ArticleDomainException } from '@/modules/Article/Domain/ArticleDomainException.ts'

export class ArticleId extends Id {
  private _brand!: void

  private constructor(value: string) {
    const normalized = value.trim()

    super(normalized)

    if (!this.isValidId(normalized)) {
      throw ArticleDomainException.invalidId()
    }
  }

  static fromString(value: string): ArticleId {
    return new ArticleId(value)
  }
}
