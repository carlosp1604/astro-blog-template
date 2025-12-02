import type { Locale } from '~/src/config/i18n.config.ts'

function hasScheme(url: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
}

const SAFE_SCHEMES = new Set([ 'http', 'https' ])

export function toAbsoluteUrl(input: string, siteBaseUrl: string): string {
  const raw = (input ?? '').trim()
  const base = new URL(siteBaseUrl)

  if (!raw) {
    return base.toString()
  }

  if (raw.startsWith('//')) {
    return `${base.protocol}${raw}`
  }

  if (hasScheme(raw)) {
    const scheme = raw.slice(0, raw.indexOf(':')).toLowerCase()

    if (SAFE_SCHEMES.has(scheme)) {
      return raw
    }

    return base.toString()
  }

  return new URL(raw.replace(/^\//, ''), base).toString()
}

export function buildCanonical(path: string, siteBaseUrl: string): string {
  return new URL(path.replace(/^\//, ''), siteBaseUrl).toString()
}

export type Hreflang = { lang: string; url: string }

export function buildHreflangs(locales: readonly Locale[], siteBaseUrl: string, pathFactory: (locale: string) => string): Hreflang[] {
  return locales.map((locale) => ({
    lang: locale,
    url: buildCanonical(pathFactory(locale), siteBaseUrl)
  }))
}

export function buildRelativeUrl(
  lang: string,
  fragments: string[] = [],
  searchParams?: URLSearchParams
): string {
  const stripSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '')

  const sanitizeFragment = (str: string) => {
    return stripSlashes(str).replace(/[?#]/g, '')
  }

  const cleanLang = stripSlashes(lang)

  const cleanFragments = fragments
    .map(sanitizeFragment)
    .filter(Boolean)

  const segments = [ cleanLang, ...cleanFragments ].filter(Boolean)

  let url = `/${segments.join('/')}`

  if (url !== '/' && !url.endsWith('/')) {
    url += '/'
  }

  if (searchParams) {
    const queryString = searchParams.toString()

    if (queryString.length > 0) {
      url += `?${queryString}`
    }
  }

  return url
}

function normalizePath (path: string) {
  return path.replace(/\/$/, '') || '/'
}

export function isActiveLink (
  currentPath: string,
  href: string,
  exact: boolean
) {
  const path = normalizePath(currentPath)
  const link = normalizePath(href)

  if (exact) {
    return path === link
  }

  return path.startsWith(link)
}
