import type { SortOrder } from '@/modules/Shared/CriteriaSortOrder.ts'
import type { Locale } from '@/modules/Shared/LocaleValueObject.ts'

export type ArticleSortBy = 'relevance' | 'date'
export type ArticleSortOrder = SortOrder

export class Pagination {
  private constructor(public readonly offset: number, public readonly limit: number) {
  }

  static fromPage(
    page: number,
    size: number,
    minPageNumber: number,
    maxPageNumber: number,
    minPageSize: number,
    maxPageSize: number
  ) {
    let validatedPageNumber = page

    if (validatedPageNumber < minPageNumber) {
      validatedPageNumber = minPageNumber
    }

    if (validatedPageNumber > maxPageNumber) {
      validatedPageNumber = maxPageNumber
    }

    let validatePageSize = size

    if (validatePageSize < minPageSize) {
      validatePageSize = minPageSize
    }

    if (validatePageSize > maxPageSize) {
      validatePageSize = maxPageSize
    }

    return new Pagination((validatedPageNumber - 1) * validatePageSize, validatePageSize)
  }
}

export class Sort {
  private constructor(public readonly by: ArticleSortBy, public readonly order: ArticleSortOrder) {
  }

  static create(by?: unknown, order?: unknown) {
    const validateBy: ArticleSortBy = by === 'relevance' ? 'relevance' : 'date'
    const validatedOrder: ArticleSortOrder  = order === 'asc' ? 'asc' : 'desc'

    return new Sort(validateBy, validatedOrder)
  }
}

export class ArticlesCriteria {
  private constructor(
    public readonly pagination: Pagination,
    public readonly sort: Sort,
    public readonly locale: Locale,
    public readonly categoryId?: string,
  ) {
  }

  static create(args: {
    page: number
    size: number
    minPageNumber: number
    maxPageNumber: number
    minPageSize: number
    maxPageSize: number
    locale: Locale
    sortBy?: unknown
    sortOrder?: unknown
    categoryId?: string
  }) {
    return new ArticlesCriteria(
      Pagination.fromPage(args.page, args.size, args.minPageNumber, args.maxPageNumber, args.minPageSize, args.maxPageSize),
      Sort.create(args.sortBy, args.sortOrder),
      args.locale,
      args.categoryId,
    )
  }
}
