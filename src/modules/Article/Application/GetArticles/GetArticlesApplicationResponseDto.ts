import type { ArticleApplicationDto } from '@/modules/Article/Application/ArticleApplicationDto.ts'

export interface GetArticlesCriteriaDto {
  locale: string
  sortBy: string
  sortOrder: string
  categoryId?: string
  title?: string
}

export interface GetArticlesApplicationResponseDto {
  articles: Array<ArticleApplicationDto>
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
  criteria: GetArticlesCriteriaDto
}
