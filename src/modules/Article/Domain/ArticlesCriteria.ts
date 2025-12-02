import type { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import type { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'
import type { SortOrder, SortBy } from '@/modules/Shared/Domain/CriteriaSortOptions.ts'

type ArticleSortBy = SortBy
type ArticleSortOrder = SortOrder

export class Pagination {
  private constructor(public readonly offset: number, public readonly limit: number) {}

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
  private constructor(public readonly by: ArticleSortBy, public readonly order: ArticleSortOrder) {}

  static create(by?: string, order?: string) {
    const validateBy: ArticleSortBy = by === 'relevance' ? 'relevance' : 'date'
    const validatedOrder: ArticleSortOrder = order === 'asc' ? 'asc' : 'desc'

    return new Sort(validateBy, validatedOrder)
  }
}

export class ArticlesCriteria {
  private constructor(
    public readonly pagination: Pagination,
    public readonly sort: Sort,
    public readonly locale: Locale,
    public readonly categoryId?: CategoryId,
    public readonly tagId?: TagId,
    public readonly title?: string
  ) {}

  static create(args: {
    page: number
    size: number
    minPageNumber: number
    maxPageNumber: number
    minPageSize: number
    maxPageSize: number
    locale: Locale
    sortBy?: string
    sortOrder?: string
    categoryId?: CategoryId
    tagId?: TagId
    title?: string
  }) {
    let validatedTitle: string | undefined = undefined

    if (args.title !== undefined) {
      if (args.title.trim() !== '') {
        validatedTitle = args.title
      }
    }

    return new ArticlesCriteria(
      Pagination.fromPage(args.page, args.size, args.minPageNumber, args.maxPageNumber, args.minPageSize, args.maxPageSize),
      Sort.create(args.sortBy, args.sortOrder),
      args.locale,
      args.categoryId,
      args.tagId,
      validatedTitle
    )
  }
}
