import rss from '@astrojs/rss'
import container from '~/container.ts'
import { env } from '~/env.loader'
import { i18nConfig } from '@/config/i18n.config.ts'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles.ts'
import { ARTICLES_PATH } from '@/modules/Shared/Infrastructure/Frontend/Paths.ts'
import { t, validateLocale } from '@/translations'
import { buildCanonical, buildRelativeUrl } from '@/modules/Shared/Infrastructure/Frontend/Url.ts'
import type { APIContext } from 'astro'
import {
  DEFAULT_ARTICLE_ORDER,
  DEFAULT_ARTICLE_SORT
} from '@/modules/Shared/Infrastructure/Frontend/ArticleSortOptions.ts'

export async function getStaticPaths() {
  const paths = []

  for (const locale of i18nConfig.locales) {
    paths.push({ params: { lang: locale } })
  }

  return paths
}

export async function GET(context: APIContext) {
  const rawLang = context.params.lang

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  const siteBaseUrl = env.PUBLIC_SITE_BASE_URL
  const siteName = env.PUBLIC_SITE_NAME

  const getArticlesUseCase = container.resolve<GetArticles>('getArticles')

  const getArticlesResult = await getArticlesUseCase.get({
    locale: lang,
    pageNumber: 1,
    pageSize: 20,
    sortOption: DEFAULT_ARTICLE_SORT,
    sortOrder: DEFAULT_ARTICLE_ORDER,
    filters: {}
  })

  if (!getArticlesResult.success) {
    console.error(`[RSS Build Error] Failed to generate RSS for ${lang}`)
    console.error(getArticlesResult.error)

    throw new Error(`RSS Generation Failed for ${lang}`)
  }

  const articlesPage = getArticlesResult.value

  const titleTranslation = await t(lang, 'common', 'rss_page_title', { siteName, lang: lang.toUpperCase() })
  const descriptionTranslation = await t(lang, 'common', 'rss_page_description', { siteName })

  return rss({
    title: titleTranslation,
    description: descriptionTranslation,
    site: siteBaseUrl,
    customData: `<language>${lang}</language>`,
    items: articlesPage.articles.map((article) => ({
      title: article.title,
      pubDate: new Date(article.publishedAt),
      description: article.description,
      link: buildCanonical(buildRelativeUrl(lang, [ ARTICLES_PATH, article.slug ]), siteBaseUrl)
    }))
  })
}
