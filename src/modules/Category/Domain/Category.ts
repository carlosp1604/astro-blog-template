import { Relationship } from '@/modules/Shared/Domain/Relationship/Relationship.ts'
import { RelationshipCollection } from '@/modules/Shared/Domain/Relationship/RelationshipCollection.ts'
import type { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'
import type { CategorySlug } from '@/modules/Category/Domain/ValueObject/CategorySlug.ts'

export class Category {
  public readonly id: CategoryId
  public readonly slug: CategorySlug
  public readonly name: string
  public readonly description: string
  public readonly imageUrl: string | null
  public readonly imageAltTitle: string | null
  public readonly parentId: string | null
  public readonly articlesCount: number

  /** Relationships **/
  public readonly _parentCategory: Relationship<Category | null>
  public readonly _childCategories: RelationshipCollection<Category>

  constructor(
    id: CategoryId,
    slug: CategorySlug,
    name: string,
    description: string,
    imageUrl: string | null,
    imageAltTitle: string | null,
    parentId: string | null,
    articlesCount: number,
    parentCategory: Relationship<Category | null> = Relationship.notLoaded(),
    childCategories: RelationshipCollection<Category> = RelationshipCollection.notLoaded()
  ) {
    this.id = id
    this.slug = slug
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.imageAltTitle = imageAltTitle
    this.parentId = parentId
    this._parentCategory = parentCategory
    this._childCategories = childCategories
    this.articlesCount = articlesCount
  }

  public get parentCategory (): Category | null {
    return this._parentCategory.value
  }

  public get childCategories (): Array<Category> {
    return this._childCategories.values
  }
}
