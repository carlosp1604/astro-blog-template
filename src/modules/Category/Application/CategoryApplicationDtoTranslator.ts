import type { CategoryApplicationDto } from '@/modules/Category/Application/CategoryApplicationDto.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'

export class CategoryApplicationDtoTranslator {
  public static fromDomain(domain: Category): CategoryApplicationDto {
    return {
      id: domain.id,
      slug: domain.slug,
      name: domain.name,
      description: domain.description,
      imageUrl: domain.imageUrl,
      imageAltTitle: domain.imageAltTitle,
      postCount: domain.postCount,
    }
  }
}