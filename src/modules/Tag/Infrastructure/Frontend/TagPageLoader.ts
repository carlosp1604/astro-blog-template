import container from '~/container'
import { z } from 'zod'
import { env } from '~/env.loader'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles'
import { QUERY_PARAM } from '@/modules/Shared/Infrastructure/Frontend/QueryParam.ts'
import { validateLocale } from '@/translations'
import { QueryParamHelper } from '@/modules/Shared/Infrastructure/Frontend/QueryParamHelper'
import { GetTagBySlugApplicationError } from '@/modules/Tag/Application/GetTagBySlug/GetTagBySlugApplicationError.ts'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import type { GetTagBySlug } from '@/modules/Tag/Application/GetTagBySlug/GetTagBySlug.ts'
import type { GetTagSlugsById } from '@/modules/Tag/Application/GetTagSlugsById/GetTagSlugsById.ts'
import type { TagApplicationDto } from '@/modules/Tag/Application/TagApplicationDto.ts'
import {
  GetTagSlugsByIdApplicationError
} from '@/modules/Tag/Application/GetTagSlugsById/GetTagSlugsByIdApplicationError.ts'
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

export interface TagPagePaginationData {
  page: number
  offset: number
  hasPrev: boolean
  hasNext: boolean
  totalItems: number
  articlesSlugWithTitle: Array<ArticleSlugWithTitle>
}

export interface TagPageData {
  tag: TagApplicationDto
  slugs: Record<string, string>
  pagination: TagPagePaginationData
  lang: Locale
  articlesPage: GetArticlesApplicationResponseDto
}

const TagPageQuerySchema = z.object({
  [QUERY_PARAM.PAGE]: z.coerce.number().int().positive().default(1),
  [QUERY_PARAM.PER_PAGE]: z.coerce.number().int().positive()
    .min(env.PAGINATION_MIN_PAGE_SIZE)
    .max(env.PAGINATION_MAX_PAGE_SIZE)
    .default(env.PUBLIC_DEFAULT_PAGE_SIZE),
  [QUERY_PARAM.SORT]: z.enum(ARTICLE_SORT_OPTIONS).default(DEFAULT_ARTICLE_SORT),
  [QUERY_PARAM.ORDER]: z.enum(ARTICLE_ORDER_OPTIONS).default(DEFAULT_ARTICLE_ORDER)
})

export async function loadTagPage(
  astro: Pick<AstroGlobal, 'url' | 'params' | 'redirect'>
): Promise<Response | TagPageData> {
  const { lang: rawLang, slug } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  if (!slug) {
    return new Response(null, { status: 404 })
  }

  const validator = new QueryParamHelper(TagPageQuerySchema, astro.url.searchParams)

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

  const getTagBySlugUseCase = container.resolve<GetTagBySlug>('getTagBySlug')
  const getTagSlugsByIdUseCase = container.resolve<GetTagSlugsById>('getTagSlugsById')
  const getArticlesUseCase = container.resolve<GetArticles>('getArticles')

  const getTagResult = await getTagBySlugUseCase.get({ locale: lang, slug })

  if (!getTagResult.success) {
    if (getTagResult.error.id === GetTagBySlugApplicationError.notFoundId) {
      return new Response(null, { status: 404 })
    }
    throw getTagResult.error
  }

  const tag = getTagResult.value

  const [ getSlugsResult, getArticlesResult ] = await Promise.all([
    getTagSlugsByIdUseCase.get({ id: tag.id }),
    getArticlesUseCase.get({
      pageNumber: page,
      pageSize: perPage,
      sortOption: sort,
      sortOrder: order,
      locale: lang,
      filters: { tagId: tag.id }
    })
  ])

  if (!getSlugsResult.success) {
    if (getSlugsResult.error.id === GetTagSlugsByIdApplicationError.notFoundId) {
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
    tag,
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
