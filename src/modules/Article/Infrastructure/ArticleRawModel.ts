import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'

export interface ArticleRawModel {
  id: string
  title: string
  description: string
  slug: string
  imageUrl: string
  imageAltTitle: string | null
  authorName: string
  publishedAt: string
  updatedAt: string
  body: string | undefined
  categories: Array<CategoryRawModel> | undefined
}