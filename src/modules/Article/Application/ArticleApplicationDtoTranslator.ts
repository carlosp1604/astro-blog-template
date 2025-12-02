import type { ArticleApplicationDto } from '@/modules/Article/Application/ArticleApplicationDto.ts'
import type { Article } from '@/modules/Article/Domain/Article.ts'

export class ArticleApplicationDtoTranslator {
  public static fromDomain(domain: Article): ArticleApplicationDto {
    return {
      id: domain.id.toString(),
      slug: domain.slug.toString(),
      title: domain.title,
      imageUrl: domain.imageUrl,
      description: domain.description,
      updatedAt: domain.updatedAt.toISOString(),
      publishedAt: domain.publishedAt.toISOString(),
      imageAltTitle: domain.imageAltTitle
    }
  }
}
