export interface ArticleCategoryApplicationDto {
  id: string
  slug: string
  name: string
}

export interface ArticleTagApplicationDto {
  id: string
  slug: string
  name: string
}

export interface ArticleWithContentAndCategoriesAndTagsApplicationDto {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAltTitle: string
  publishedAt: string
  updatedAt: string
  authorName: string
  readingTime: number
  categories: Array<ArticleCategoryApplicationDto>
  tags: Array<ArticleTagApplicationDto>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}
