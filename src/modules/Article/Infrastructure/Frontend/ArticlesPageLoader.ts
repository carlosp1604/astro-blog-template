import container from '~/container.ts'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import { z } from 'zod'
import { env } from '~/env.loader.ts'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles.ts'
import { QUERY_PARAM } from '@/modules/Shared/Infrastructure/Frontend/QueryParam.ts'
import { QueryParamHelper } from '@/modules/Shared/Infrastructure/Frontend/QueryParamHelper.ts'
import { t, validateLocale } from '@/translations'
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

export interface ArticlesPagePaginationData {
  page: number
  offset: number
  hasPrev: boolean
  hasNext: boolean
  totalItems: number
  title: string | undefined
  articlesSlugWithTitle: Array<ArticleSlugWithTitle>
}

export interface ArticlesPageData {
  pageTitle: string
  pageDescription: string
  pagination: ArticlesPagePaginationData
  articlesPage: GetArticlesApplicationResponseDto
  lang: Locale
}

const ArticlesPageQuerySchema = z.object({
  [QUERY_PARAM.PAGE]: z.coerce.number().int().positive().default(1),
  [QUERY_PARAM.PER_PAGE]: z.coerce.number().int().positive()
    .min(env.PAGINATION_MIN_PAGE_SIZE)
    .max(env.PAGINATION_MAX_PAGE_SIZE)
    .default(env.PUBLIC_DEFAULT_PAGE_SIZE),
  [QUERY_PARAM.SORT]: z.enum(ARTICLE_SORT_OPTIONS).default(DEFAULT_ARTICLE_SORT),
  [QUERY_PARAM.ORDER]: z.enum(ARTICLE_ORDER_OPTIONS).default(DEFAULT_ARTICLE_ORDER),
  [QUERY_PARAM.TITLE]: z.string().min(1).max(512).optional()
})

export async function loadArticlesPage(
  astro: Pick<AstroGlobal, 'url' | 'params' | 'redirect'>
): Promise<Response | ArticlesPageData> {
  const { lang: rawLang } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  const validator = new QueryParamHelper(ArticlesPageQuerySchema, astro.url.searchParams)

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
    [QUERY_PARAM.PER_PAGE]: perPage,
    [QUERY_PARAM.TITLE]: title
  } = validator.values

  const getArticlesUseCase = container.resolve<GetArticles>('getArticles')

  const getArticlesResult = await getArticlesUseCase.get({
    pageNumber: page,
    pageSize: perPage,
    sortOption: sort,
    sortOrder: order,
    locale: lang,
    filters: { title }
  })

  if (!getArticlesResult.success) {
    throw getArticlesResult.error
  }
  const articlesPage = getArticlesResult.value

  let pageTitle: string
  const pageDescription = await t(lang, 'articles', 'articles_page_p_description')

  if (title) {
    pageTitle = await t(lang, 'articles', 'articles_page_h1_title_with_title_filter', { title })
  } else {
    pageTitle = await t(lang, 'articles', 'articles_page_h1_title')
  }

  if (articlesPage.page > 1) {
    const currentTitle = pageTitle

    pageTitle = await t(
      lang,
      'articles',
      'articles_page_h1_title_with_page_number',
      { title: currentTitle, pageNumber: articlesPage.page }
    )
  }

  if (page > 1 && articlesPage.articles.length === 0) {
    return new Response(null, { status: 404 })
  }

  const articlesSlugWithTitle = articlesPage.articles.map((article) => ({ slug: article.slug, title: article.title }))
  const offset = (page - 1) * perPage

  return {
    lang,
    pageTitle,
    pageDescription,
    articlesPage,
    pagination: {
      page,
      hasPrev: articlesPage.hasPrev,
      hasNext: articlesPage.hasNext,
      totalItems: articlesPage.totalItems,
      articlesSlugWithTitle,
      offset,
      title
    }
  }
}
