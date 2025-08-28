import type {
  CategoryWithParentAndChildrenApplicationDto, ChildCategoryApplicationDto, ParentCategoryApplicationDto
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDto.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'

export class CategoryWithParentAndChildrenApplicationDtoTranslator {
  public static fromDomain(domain: Category): CategoryWithParentAndChildrenApplicationDto {
    const childrenCategories: Array<ChildCategoryApplicationDto> = domain.childCategories.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
    }))

    let parentCategory: ParentCategoryApplicationDto | null = null

    if (domain.parentCategory) {
      parentCategory = {
        id: domain.parentCategory.id,
        name: domain.parentCategory.name,
        slug: domain.parentCategory.slug,
      }
    }

    return {
      id: domain.id,
      name: domain.name,
      slug: domain.slug,
      imageUrl: domain.imageUrl,
      postCount: domain.postCount,
      imageAltTitle: domain.imageAltTitle,
      description: domain.description,
      parentCategory,
      childrenCategories
    }
  }
}