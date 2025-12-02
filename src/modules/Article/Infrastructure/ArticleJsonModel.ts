export type ArticleStatus = 'published' | 'draft'

export interface ArticleJsonModel {
  id: string
  locale: string
  slug: string
  slugs: {
    [key: string]: string
  }
  title: string
  description: string
  imageUrl: string
  imageAltTitle: string
  authorName: string
  publishedAt: string
  updatedAt: string
  relevance: number
  categories: Array<string>
  tags: Array<string>
  status: ArticleStatus
  isFeatured: boolean
  readingTime: number
}
