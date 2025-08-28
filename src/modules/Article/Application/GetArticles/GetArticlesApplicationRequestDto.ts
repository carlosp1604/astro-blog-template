export interface GetArticlesApplicationRequestDto {
  pageNumber: number
  pageSize: number
  sortOption: string
  sortOrder: string
  locale: string
  categoryId: string | undefined
}