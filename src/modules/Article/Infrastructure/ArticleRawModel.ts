import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import type { TagRawModel } from '@/modules/Tag/Infrastructure/TagRawModel.ts'

export interface ArticleRawModel {
  id: string
  title: string
  description: string
  slug: string
  imageUrl: string
  imageAltTitle: string
  authorName: string
  readingTime: number
  publishedAt: string
  updatedAt: string
  categories: Array<CategoryRawModel> | undefined
  tags: Array<TagRawModel> | undefined
}
