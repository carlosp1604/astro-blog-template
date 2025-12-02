import { Article } from '@/modules/Article/Domain/Article.ts'
import { ArticleId } from '@/modules/Article/Domain/ValueObject/ArticleId.ts'
import { ArticleSlug } from '@/modules/Article/Domain/ValueObject/ArticleSlug.ts'
import { TagModelTranslator } from '@/modules/Tag/Infrastructure/TagModelTranslator.ts'
import { RelationshipCollection } from '@/modules/Shared/Domain/Relationship/RelationshipCollection.ts'
import { CategoryModelTranslator } from '@/modules/Category/Infrastructure/CategoryModelTranslator.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { ArticleRawModel } from '@/modules/Article/Infrastructure/ArticleRawModel.ts'
import type { ArticleRepositoryRelationshipsOptions } from '@/modules/Article/Domain/ArticleRepositoryInterface.ts'

export class ArticleModelTranslator {
  public static toDomain(
    rawModel: ArticleRawModel,
    relationshipsOptions: Array<ArticleRepositoryRelationshipsOptions>
  ): Article {
    let categoriesCollection: RelationshipCollection<Category> = RelationshipCollection.notLoaded()

    if (relationshipsOptions.includes('categories') && rawModel.categories) {
      categoriesCollection = RelationshipCollection.loaded(
        rawModel.categories.map((rawCategory) => {
          return CategoryModelTranslator.toDomain(rawCategory, [])
        })
      )
    }

    let tagsCollection: RelationshipCollection<Tag> = RelationshipCollection.notLoaded()

    if (relationshipsOptions.includes('tags') && rawModel.tags) {
      tagsCollection = RelationshipCollection.loaded(
        rawModel.tags.map((rawTag) => {
          return TagModelTranslator.toDomain(rawTag)
        })
      )
    }

    return new Article(
      ArticleId.fromString(rawModel.id),
      ArticleSlug.fromString(rawModel.slug),
      rawModel.title,
      rawModel.description,
      rawModel.imageUrl,
      rawModel.imageAltTitle,
      rawModel.authorName,
      rawModel.readingTime,
      new Date(rawModel.publishedAt),
      new Date(rawModel.updatedAt),
      categoriesCollection,
      tagsCollection
    )
  }
}
