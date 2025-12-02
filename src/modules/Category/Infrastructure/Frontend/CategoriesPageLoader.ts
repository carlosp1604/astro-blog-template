import container from '~/container'
import { t, validateLocale } from '@/translations'
import type { Locale } from '@/config/i18n.config.ts'
import type { AstroGlobal } from 'astro'
import type { GetCategories } from '@/modules/Category/Application/GetCategories/GetCategories.ts'
import type { CategoryApplicationDto } from '@/modules/Category/Application/CategoryApplicationDto.ts'

interface CategorySlugWithTitle {
  slug: string
  title: string
}

export interface CategoriesPagePaginationData {
  page: number
  offset: number
  hasPrev: boolean
  hasNext: boolean
  totalItems: number
  categoriesSlugWithTitle: Array<CategorySlugWithTitle>
}

export interface CategoriesPageData {
  categories: Array<CategoryApplicationDto>
  lang: Locale
  pageTitle: string
  pageDescription: string
  pagination: CategoriesPagePaginationData
}

export async function loadCategoriesPage(
  astro: Pick<AstroGlobal, 'url' | 'params'>
): Promise<Response | CategoriesPageData> {
  const { lang: rawLang } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  const getCategoriesUseCase = container.resolve<GetCategories>('getCategories')
  const getCategoriesResult = await getCategoriesUseCase.get({ locale: lang })

  if (!getCategoriesResult.success) {
    throw getCategoriesResult.error
  }

  const categories = getCategoriesResult.value

  const pageTitle = await t(lang, 'categories', 'categories_page_h1_title')
  const pageDescription = await t(lang, 'categories', 'categories_page_p_description')

  const categoriesSlugWithTitle = categories.map((category) => ({ slug: category.slug, title: category.name }))

  return {
    lang,
    categories,
    pageTitle,
    pageDescription,
    pagination: {
      // FIXME: Set the correct params when pagination is supported
      page: 1,
      hasNext: false,
      hasPrev: false,
      totalItems: categories.length,
      offset:0,
      categoriesSlugWithTitle
    }
  }
}
