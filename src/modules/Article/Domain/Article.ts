import { RelationshipCollection } from '@/modules/Shared/Domain/Relationship/RelationshipCollection.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { ArticleId } from '@/modules/Article/Domain/ValueObject/ArticleId.ts'
import type { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'

export class Article {
  public readonly id: ArticleId
  public readonly slug: ArticleSlug
  public readonly title: string
  public readonly description: string
  public readonly imageUrl: string
  public readonly imageAltTitle: string
  public readonly authorName: string
  public readonly readingTime: number
  public readonly publishedAt: Date
  public readonly updatedAt: Date

  /** Relationships **/
  public readonly _categories: RelationshipCollection<Category>
  public readonly _tags: RelationshipCollection<Tag>

  constructor(
    id: ArticleId,
    slug: ArticleSlug,
    title: string,
    description: string,
    imageUrl: string,
    imageAltTitle: string,
    authorName: string,
    readingTime: number,
    publishedAt: Date,
    updatedAt: Date,
    categories: RelationshipCollection<Category> = RelationshipCollection.notLoaded(),
    tags: RelationshipCollection<Tag> = RelationshipCollection.notLoaded()
  ) {
    this.id = id
    this.slug = slug
    this.title = title
    this.description = description
    this.imageUrl = imageUrl
    this.imageAltTitle = imageAltTitle
    this.authorName = authorName
    this.readingTime =readingTime
    this.publishedAt = publishedAt
    this.updatedAt = updatedAt
    this._categories = categories
    this._tags = tags
  }

  public get categories (): Array<Category> {
    return this._categories.values
  }

  public get tags (): Array<Tag> {
    return this._tags.values
  }
}
