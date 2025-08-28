import { Article } from '@/modules/Article/Domain/Article.ts'
import type { ArticleRepositoryRelationshipsOptions } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'
import type { ArticleRawModel } from '@/modules/Article/Infrastructure/ArticleRawModel.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import { CategoryModelTranslator } from '@/modules/Category/Infrastructure/CategoryModelTranslator.ts'
import { RelationshipCollection } from '@/modules/Shared/Domain/Relationship/RelationshipCollection.ts'

export class ArticleModelTranslator {
  public static toDomain(
    rawModel: ArticleRawModel,
    relationshipsOptions: Array<ArticleRepositoryRelationshipsOptions>
  ): Article {
    let categoriesCollection: RelationshipCollection<Category> = RelationshipCollection.notLoaded()

    if (relationshipsOptions.includes('categories') && rawModel.categories) {
      categoriesCollection = RelationshipCollection.loaded(
        rawModel.categories.map((rawCategory) => {
          return CategoryModelTranslator.toDomain(rawCategory)
        })
      )
    }

    return new Article(
      rawModel.id,
      rawModel.slug,
      rawModel.title,
      rawModel.description,
      rawModel.imageUrl,
      rawModel.imageAltTitle,
      rawModel.authorName,
      new Date(rawModel.publishedAt),
      new Date(rawModel.updatedAt),
      rawModel.body,
      categoriesCollection
    )
  }
}