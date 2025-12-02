import container from '~/container.ts'
import { t, validateLocale } from '@/translations'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import type { GetFeaturedArticles } from '@/modules/Article/Application/GetFeaturedArticles/GetFeaturedArticles.ts'
import type { ArticleApplicationDto } from '@/modules/Article/Application/ArticleApplicationDto.ts'

export interface HomePageData {
  pageTitle: string
  pageDescription: string
  articles: Array<ArticleApplicationDto>
  lang: Locale
}

export async function loadHomePage(
  astro: Pick<AstroGlobal, 'url' | 'params'>
): Promise<Response | HomePageData> {
  const { lang: rawLang } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  const getFeaturedArticlesUseCase = container.resolve<GetFeaturedArticles>('getFeaturedArticles')

  const getFeaturedArticlesResult = await getFeaturedArticlesUseCase.get({ locale: lang })

  if (!getFeaturedArticlesResult.success) {
    throw getFeaturedArticlesResult.error
  }
  const articles = getFeaturedArticlesResult.value

  const pageTitle: string = await t(lang, 'home', 'home_page_h1_title')
  const pageDescription: string = await t(lang, 'home', 'home_page_p_description_title')

  return {
    pageTitle,
    pageDescription,
    articles,
    lang
  }
}
