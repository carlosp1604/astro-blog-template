import container from '~/container'
import { t, validateLocale } from '@/translations'
import type { Locale } from '@/config/i18n.config.ts'
import type { GetTags } from '@/modules/Tag/Application/GetTags/GetTags.ts'
import type { AstroGlobal } from 'astro'
import type { TagApplicationDto } from '@/modules/Tag/Application/TagApplicationDto.ts'

interface TagSlugWithTitle {
  slug: string
  title: string
}

export interface TagsPagePaginationData {
  page: number
  offset: number
  hasPrev: boolean
  hasNext: boolean
  totalItems: number
  tagsSlugWithTitle: Array<TagSlugWithTitle>
}

export interface TagsPageData {
  tags: Array<TagApplicationDto>
  lang: Locale
  pageTitle: string
  pageDescription: string
  pagination: TagsPagePaginationData
}

export async function loadTagsPage(
  astro: Pick<AstroGlobal, 'url' | 'params'>
): Promise<Response | TagsPageData> {
  const { lang: rawLang } = astro.params

  const lang = validateLocale(rawLang)

  if (!lang) {
    return new Response(null, { status: 404 })
  }

  const getTagsUseCase = container.resolve<GetTags>('getTags')
  const getTagsResult = await getTagsUseCase.get({ locale: lang })

  if (!getTagsResult.success) {
    throw getTagsResult.error
  }

  const tags = getTagsResult.value

  const pageTitle = await t(lang, 'tags', 'tags_page_h1_title')
  const pageDescription = await t(lang, 'tags', 'tags_page_p_description')

  const tagsSlugWithTitle = tags.map((tag) => ({ slug: tag.slug, title: tag.name }))

  return {
    lang,
    tags,
    pageTitle,
    pageDescription,
    pagination: {
      // FIXME: Set the correct params when pagination is supported
      page: 1,
      hasNext: false,
      hasPrev: false,
      totalItems: tags.length,
      offset:0,
      tagsSlugWithTitle
    }
  }
}
