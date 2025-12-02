import container from '~/container'
import { validateLocale } from '@/translations'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import type { GetArticleBySlug } from '@/modules/Article/Application/GetArticleBySlug/GetArticleBySlug.ts'
import type { GetArticleSlugsById } from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsById.ts'
import {
  GetArticleBySlugApplicationError
} from '@/modules/Article/Application/GetArticleBySlug/GetArticleBySlugApplicationError.ts'
import {
  GetCategorySlugsByIdApplicationError
} from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsByIdApplicationError'
import type {
  ArticleWithContentAndCategoriesAndTagsApplicationDto
} from '@/modules/Article/Application/ArticleWithContentAndCategoriesAndTagsApplicationDto.ts'

export interface ArticlePageData {
  article: ArticleWithContentAndCategoriesAndTagsApplicationDto
  slugs: Record<string, string>
  lang: Locale
}

export async function loadArticlePage(
  astro: Pick<AstroGlobal, 'url' | 'params'>
): Promise<Response | ArticlePageData> {
  const { lang: rawLang, slug } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  if (!slug) {
    return new Response(null, { status: 404 })
  }

  const getArticleBySlugUseCase = container.resolve<GetArticleBySlug>('getArticleBySlug')
  const getArticleSlugsByIdUseCase = container.resolve<GetArticleSlugsById>('getArticleSlugsById')

  const getArticleResult = await getArticleBySlugUseCase.get({ locale: lang, slug })

  if (!getArticleResult.success) {
    if (getArticleResult.error.id === GetArticleBySlugApplicationError.notFoundId) {
      return new Response(null, { status: 404 })
    }
    throw getArticleResult.error
  }

  const article = getArticleResult.value

  const getSlugsResult = await getArticleSlugsByIdUseCase.get({ id: article.id })

  if (!getSlugsResult.success) {
    if (getSlugsResult.error.id === GetCategorySlugsByIdApplicationError.notFoundId) {
      return new Response(null, { status: 404 })
    }
    throw getSlugsResult.error
  }

  const slugs = getSlugsResult.value

  return {
    lang,
    article,
    slugs
  }
}
