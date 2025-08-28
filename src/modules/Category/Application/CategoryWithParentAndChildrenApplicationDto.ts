export interface ParentCategoryApplicationDto {
  id: string
  name: string
  slug: string
}

export interface ChildCategoryApplicationDto {
  id: string
  name: string
  slug: string
}

export interface CategoryWithParentAndChildrenApplicationDto {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string | null
  imageAltTitle: string | null
  postCount: number
  parentCategory: ParentCategoryApplicationDto | null
  childrenCategories: Array<ChildCategoryApplicationDto>
}