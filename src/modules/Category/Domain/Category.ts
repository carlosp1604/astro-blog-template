import { Relationship } from '@/modules/Shared/Domain/Relationship/Relationship.ts'
import { RelationshipCollection } from '@/modules/Shared/Domain/Relationship/RelationshipCollection.ts'

export class Category {
  public readonly id: string
  public readonly slug: string
  public readonly name: string
  public readonly description: string
  public readonly imageUrl: string | null
  public readonly imageAltTitle: string | null
  public readonly parentId: string | null
  public readonly postCount: number

  /** Relationships **/
  public readonly _parentCategory: Relationship<Category | null>
  public readonly _childCategories: RelationshipCollection<Category>

  constructor(
    id: string,
    slug: string,
    name: string,
    description: string,
    imageUrl: string | null,
    imageAltTitle: string | null,
    parentId: string | null,
    postCount: number,
    parentCategory: Relationship<Category | null> = Relationship.notLoaded(),
    childCategories: RelationshipCollection<Category> = RelationshipCollection.notLoaded(),
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
    this.postCount = postCount
  }

  public get parentCategory (): Category | null {
    return this._parentCategory.value
  }

  public get childCategories (): Array<Category> {
    return this._childCategories.values
  }
}