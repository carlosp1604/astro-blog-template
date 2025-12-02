import { t } from '@/translations'
import { buildRelativeUrl } from '@/modules/Shared/Infrastructure/Frontend/Url.ts'
import { ARTICLES_PATH, CATEGORIES_PATH, TAGS_PATH } from '@/modules/Shared/Infrastructure/Frontend/Paths.ts'
import type { Locale } from '@/config/i18n.config.ts'

interface NavItem {
  label: string
  href: string
  exact: boolean
}

export async function getNavItems (lang: Locale): Promise<Array<NavItem>> {
  return [
    {
      label: await t(lang, 'common', 'nav_item_home_link_title'),
      href: buildRelativeUrl(lang, []),
      exact: true
    },
    {
      label: await t(lang, 'common', 'nav_item_articles_link_title'),
      href: buildRelativeUrl(lang, [ ARTICLES_PATH ]),
      exact: false
    },
    {
      label: await t(lang, 'common', 'nav_item_categories_link_title'),
      href: buildRelativeUrl(lang, [ CATEGORIES_PATH ]),
      exact: false
    },
    {
      label: await t(lang, 'common', 'nav_item_tags_link_title'),
      href: buildRelativeUrl(lang, [ TAGS_PATH ]),
      exact: false
    }
  ]
}
