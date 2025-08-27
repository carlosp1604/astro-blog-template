import type { Article } from '@/modules/Article/Domain/Article.ts'

export interface ArticlesPage {
  items: Array<Article>
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}