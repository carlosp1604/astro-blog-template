export interface CategoryRawModel {
  id: string
  name: string
  description: string
  imageUrl: string | null
  imageAltTitle: string | null
  parentId: string | null
  articlesCount: number | null
  slug: string
  parentCategory: CategoryRawModel | undefined
  childCategories: Array<CategoryRawModel> | undefined
}