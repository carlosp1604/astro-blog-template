import { Category } from '@/modules/Category/Domain/Category.ts'
import type { CategoryRepositoryRelationshipOptions } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import { Relationship } from '@/modules/Shared/Relationship/Relationship.ts'
import { RelationshipCollection } from '@/modules/Shared/Relationship/RelationshipCollection.ts'

export class CategoryModelTranslator {
  public static toDomain(
    rawModel: CategoryRawModel,
    relationships: Array<CategoryRepositoryRelationshipOptions>
  ): Category {
    let childrenCategories: RelationshipCollection<Category> = RelationshipCollection.notLoaded()
    let parentCategory: Relationship<Category> = Relationship.notLoaded()

    if (relationships.includes('childrenCategories') && rawModel.childCategories) {
      const childCategoriesDomainModels = rawModel.childCategories.map((childCategory) => {
        return CategoryModelTranslator.toDomain(childCategory, [])
      })

      childrenCategories = RelationshipCollection.loaded(childCategoriesDomainModels)
    }

    if (relationships.includes('parentCategory') && rawModel.parentCategory) {
      const parentCategoryDomainModel = CategoryModelTranslator.toDomain(rawModel.parentCategory, [])

      parentCategory = Relationship.loaded(parentCategoryDomainModel)
    }

    return new Category(
      rawModel.id,
      rawModel.slug,
      rawModel.name,
      rawModel.description,
      rawModel.imageUrl,
      rawModel.imageAltTitle,
      rawModel.parentId,
      rawModel.postCount ? rawModel.postCount : 0,
      parentCategory,
      childrenCategories,
    )
  }
}