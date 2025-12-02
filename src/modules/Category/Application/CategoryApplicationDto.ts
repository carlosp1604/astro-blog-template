export interface CategoryApplicationDto {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string | null
  imageAltTitle: string | null
  articlesCount: number
}
