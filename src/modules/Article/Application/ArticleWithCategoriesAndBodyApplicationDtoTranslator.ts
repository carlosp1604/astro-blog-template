import type {
  ArticleWithCategoriesAndBodyApplicationDto,
  ArticleCategoryApplicationDto
} from '@/modules/Article/Application/ArticleWithCategoriesAndBodyApplicationDto.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'

export class ArticleWithCategoriesAndBodyApplicationDtoTranslator {
  public static fromDomain(domain: Article): ArticleWithCategoriesAndBodyApplicationDto {
    const categories: Array<ArticleCategoryApplicationDto> = domain.categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      id: category.id,
    }))

    return {
      id: domain.id,
      slug: domain.slug,
      body: domain.body,
      categories,
      title: domain.title,
      imageUrl: domain.imageUrl,
      description: domain.description,
      updatedAt: domain.updatedAt.toISOString(),
      publishedAt: domain.publishedAt.toISOString(),
      imageAltTitle: domain.imageAltTitle,
    }
  }
}