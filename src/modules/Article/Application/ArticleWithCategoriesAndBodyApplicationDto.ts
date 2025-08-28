export interface ArticleCategoryApplicationDto {
  id: string
  slug: string
  name: string
}

export interface ArticleWithCategoriesAndBodyApplicationDto {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAltTitle: string | null
  publishedAt: string
  updatedAt: string
  body: string
  categories: Array<ArticleCategoryApplicationDto>
}