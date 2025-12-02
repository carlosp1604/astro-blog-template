import container from '~/container'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import { z } from 'zod'
import { env } from '~/env.loader'
import { QUERY_PARAM } from '@/modules/Shared/Infrastructure/Frontend/QueryParam.ts'
import { validateLocale } from '@/translations'
import { QueryParamHelper } from '@/modules/Shared/Infrastructure/Frontend/QueryParamHelper'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles'
import { GetCategoryBySlug } from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlug'
import { GetCategorySlugsById } from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsById'
import { GetCategoryBySlugApplicationError } from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlugApplicationError'
import {
  GetCategorySlugsByIdApplicationError
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationError'
import type {
  CategoryWithParentAndChildrenApplicationDto
} from '@/modules/Category/Application/CategoryWithParentAndChildrenApplicationDto.ts'
import type {
  GetArticlesApplicationResponseDto
} from '@/modules/Article/Application/GetArticles/GetArticlesApplicationResponseDto.ts'
import {
  ARTICLE_ORDER_OPTIONS,
  ARTICLE_SORT_OPTIONS, DEFAULT_ARTICLE_ORDER,
  DEFAULT_ARTICLE_SORT
} from '@/modules/Shared/Infrastructure/Frontend/ArticleSortOptions.ts'

interface ArticleSlugWithTitle {
  slug: string
  title: string
}

export interface CategoryPagePaginationData {
  page: number
  offset: number
  hasPrev: boolean
  hasNext: boolean
  totalItems: number
  articlesSlugWithTitle: Array<ArticleSlugWithTitle>
}

export interface CategoryPageData {
  category: CategoryWithParentAndChildrenApplicationDto
  slugs: Record<string, string>
  pagination: CategoryPagePaginationData
  lang: Locale
  articlesPage: GetArticlesApplicationResponseDto
}

const CategoryPageQuerySchema = z.object({
  [QUERY_PARAM.PAGE]: z.coerce.number().int().positive().default(1),
  [QUERY_PARAM.PER_PAGE]: z.coerce.number().int().positive()
    .min(env.PAGINATION_MIN_PAGE_SIZE)
    .max(env.PAGINATION_MAX_PAGE_SIZE)
    .default(env.PUBLIC_DEFAULT_PAGE_SIZE),
  [QUERY_PARAM.SORT]: z.enum(ARTICLE_SORT_OPTIONS).default(DEFAULT_ARTICLE_SORT),
  [QUERY_PARAM.ORDER]: z.enum(ARTICLE_ORDER_OPTIONS).default(DEFAULT_ARTICLE_ORDER)
})

export async function loadCategoryPage(
  astro: Pick<AstroGlobal, 'url' | 'params' | 'redirect'>
): Promise<Response | CategoryPageData> {
  const { lang: rawLang, slug } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  if (!slug) {
    return new Response(null, { status: 404 })
  }

  const validator = new QueryParamHelper(CategoryPageQuerySchema, astro.url.searchParams)

  validator.validate()

  if (validator.shouldRedirect) {
    const cleanQuery = validator.toQueryString()
    const cleanPath = astro.url.pathname + (cleanQuery ? `?${cleanQuery}` : '')

    return astro.redirect(cleanPath, 301)
  }

  const {
    [QUERY_PARAM.PAGE]: page,
    [QUERY_PARAM.SORT]: sort,
    [QUERY_PARAM.ORDER]: order,
    [QUERY_PARAM.PER_PAGE]: perPage
  } = validator.values

  const getCategoryBySlugUseCase = container.resolve<GetCategoryBySlug>('getCategoryBySlug')
  const getCategorySlugsByIdUseCase = container.resolve<GetCategorySlugsById>('getCategorySlugsById')
  const getArticlesUseCase = container.resolve<GetArticles>('getArticles')

  const getCategoryResult = await getCategoryBySlugUseCase.get({ locale: lang, slug })

  if (!getCategoryResult.success) {
    if (getCategoryResult.error.id === GetCategoryBySlugApplicationError.notFoundId) {
      return new Response(null, { status: 404 })
    }
    throw getCategoryResult.error
  }

  const category = getCategoryResult.value

  const [ getSlugsResult, getArticlesResult ] = await Promise.all([
    getCategorySlugsByIdUseCase.get({ id: category.id }),
    getArticlesUseCase.get({
      pageNumber: page,
      pageSize: perPage,
      sortOption: sort,
      sortOrder: order,
      locale: lang,
      filters: { categoryId: category.id }
    })
  ])

  if (!getSlugsResult.success) {
    if (getSlugsResult.error.id === GetCategorySlugsByIdApplicationError.notFoundId) {
      return new Response(null, { status: 404 })
    }
    throw getSlugsResult.error
  }

  const slugs = getSlugsResult.value

  if (!getArticlesResult.success) {
    throw getArticlesResult.error
  }
  const articlesPage = getArticlesResult.value

  if (page > 1 && articlesPage.articles.length === 0) {
    return new Response(null, { status: 404 })
  }

  const articlesSlugWithTitle = articlesPage.articles.map((article) => ({ slug: article.slug, title: article.title }))
  const offset = (page - 1) * perPage

  return {
    lang,
    category,
    slugs,
    articlesPage,
    pagination: {
      page,
      hasPrev: articlesPage.hasPrev,
      hasNext: articlesPage.hasNext,
      totalItems: articlesPage.totalItems,
      articlesSlugWithTitle,
      offset
    }
  }
}
