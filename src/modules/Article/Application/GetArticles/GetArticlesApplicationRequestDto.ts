interface GetArticlesFilterApplicationDto {
  title: string
  categoryId: string
  tagId: string
}

export interface GetArticlesApplicationRequestDto {
  readonly pageNumber: number
  readonly pageSize: number
  readonly sortOption: string
  readonly sortOrder: string
  readonly locale: string
  readonly filters: Partial<GetArticlesFilterApplicationDto>
}
