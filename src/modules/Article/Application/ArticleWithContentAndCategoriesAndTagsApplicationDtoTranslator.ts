import type { Article } from '@/modules/Article/Domain/Article.ts'
import type {
  ArticleWithContentAndCategoriesAndTagsApplicationDto,
  ArticleCategoryApplicationDto, ArticleTagApplicationDto
} from '@/modules/Article/Application/ArticleWithContentAndCategoriesAndTagsApplicationDto.ts'

export class ArticleWithContentAndCategoriesAndTagsApplicationDtoTranslator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromDomain(domain: Article, content: any): ArticleWithContentAndCategoriesAndTagsApplicationDto {
    const categories: Array<ArticleCategoryApplicationDto> = domain.categories.map((category) => ({
      slug: category.slug.toString(),
      name: category.name,
      id: category.id.toString()
    }))

    const tags: Array<ArticleTagApplicationDto> = domain.tags.map((tag) => ({
      slug: tag.slug.toString(),
      name: tag.name,
      id: tag.id.toString()
    }))

    return {
      id: domain.id.toString(),
      slug: domain.slug.toString(),
      categories,
      tags,
      authorName: domain.authorName,
      readingTime: domain.readingTime,
      title: domain.title,
      imageUrl: domain.imageUrl,
      description: domain.description,
      updatedAt: domain.updatedAt.toISOString(),
      publishedAt: domain.publishedAt.toISOString(),
      imageAltTitle: domain.imageAltTitle,
      content
    }
  }
}
