export interface ArticleApplicationDto {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  imageAltTitle: string | null
  publishedAt: string
  updatedAt: string
}