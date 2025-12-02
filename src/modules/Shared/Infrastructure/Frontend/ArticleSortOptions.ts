import type { SortBy, SortOrder } from '@/modules/Shared/Domain/CriteriaSortOptions.ts'

export const ARTICLE_SORT_OPTIONS = [ 'date', 'relevance' ] as const satisfies ReadonlyArray<SortBy>
export const ARTICLE_ORDER_OPTIONS = [ 'desc', 'asc' ] as const satisfies ReadonlyArray<SortOrder>

export type ArticleSortOption = (typeof ARTICLE_SORT_OPTIONS)[number]
export type ArticleOrderOption = (typeof ARTICLE_ORDER_OPTIONS)[number]

export const DEFAULT_ARTICLE_SORT: ArticleSortOption = 'date'
export const DEFAULT_ARTICLE_ORDER: ArticleOrderOption = 'desc'
