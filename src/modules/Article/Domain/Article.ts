import { ArticleDomainException } from '@/modules/Article/Domain/ArticleDomainException.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import { RelationshipCollection } from '@/modules/Shared/Relationship/RelationshipCollection.ts'

export class Article {
  public readonly id: string
  public readonly slug: string
  public readonly title: string
  public readonly description: string
  public readonly imageUrl: string
  public readonly imageAltTitle: string | null
  public readonly authorName: string
  public readonly publishedAt: Date
  public readonly updatedAt: Date
  public readonly _body: string | undefined

  /** Relationships **/
  public readonly _categories: RelationshipCollection<Category>

  constructor(
    id: string,
    slug: string,
    title: string,
    description: string,
    imageUrl: string,
    imageAltTitle: string | null,
    authorName: string,
    publishedAt: Date,
    updatedAt: Date,
    body: string | undefined,
    categories: RelationshipCollection<Category> = RelationshipCollection.notLoaded()
  ) {
    this.id = id
    this.slug = slug
    this.title = title
    this.description = description
    this.imageUrl = imageUrl
    this.imageAltTitle = imageAltTitle
    this.authorName = authorName
    this.publishedAt = publishedAt
    this.updatedAt = updatedAt
    this._body = body
    this._categories = categories
  }

  public get body (): string {
    if (!this._body) {
      throw ArticleDomainException.bodyNotLoaded(this.id)
    }

    return this._body
  }

  public get categories (): Array<Category> {
    return this._categories.values
  }
}