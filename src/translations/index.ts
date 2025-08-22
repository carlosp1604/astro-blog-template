import { i18nConfig, type Locale, type Namespace } from '@/config/i18n.config.ts'

const modules = import.meta.glob('./*/**/*.json', { eager: false })

const cache: Partial<Record<Locale, Partial<Record<Namespace, Record<string, unknown>>>>> = {}

type Params = Record<string, string | number>

async function loadNamespace(lang: Locale, ns: Namespace) {
  cache[lang] ||= {}
  if (!cache[lang]![ns]) {
    const key = `./${lang}/${ns}.json`
    const loader = modules[key]

    if (!loader) {
      throw new Error(`Missing translations: ${key}`)
    }
    const mod = (await loader()) as { default: Record<string, unknown> }

    cache[lang]![ns] = mod.default
  }

  return cache[lang]![ns]!
}

function resolvePath(obj: Record<string, unknown>, path: string[]) {
  let cur: unknown = obj

  for (const p of path) {
    // @ts-expect-error index by dynamic path
    cur = cur?.[p]
    if (cur === undefined) {
      return undefined
    }
  }

  return cur
}

function interpolate(str: string, params: Params): string {
  return str.replace(/\{(\w+)\}/g, (_, match) =>
    params[match] !== undefined ? String(params[match]) : `{${match}}`
  )
}

export async function t(
  lang: Locale,
  ns: Namespace,
  key: string,
  params: Params = {}
): Promise<string> {
  const data = await loadNamespace(lang, ns)
  const found = resolvePath(data, key.split('.'))

  if (found !== undefined) {
    return interpolate(String(found), params)
  }

  if (lang !== i18nConfig.defaultLocale) {
    const fb = await loadNamespace(i18nConfig.defaultLocale, ns)
    const v = resolvePath(fb, key.split('.'))

    if (v !== undefined) {
      return interpolate(String(v), params)
    }
  }

  return `${ns}.${key}`
}

export function tKey(lang: Locale, fullKey: string) {
  const [ ns, ...rest ] = fullKey.split('.') as [Namespace, ...string[]]

  return t(lang, ns, rest.join('.'))
}

export function getLanguageHref(target: Locale): string | void {
  try {
    if (!i18nConfig.locales.includes(target)) return

    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || ''
    const { pathname, search, hash } = window.location

    const withoutBase = pathname.startsWith(base + '/')
      ? pathname.slice(base.length)
      : pathname

    const parts = withoutBase.split('/').filter(Boolean)
    const hasLocale = parts.length > 0 && i18nConfig.locales.includes(parts[0] as Locale)

    if (hasLocale) parts[0] = target
    else parts.unshift(target)

    const hadTrailing = pathname.endsWith('/')
    const newPath = '/' + parts.join('/') + (hadTrailing ? '/' : '')

    return base + newPath + search + hash
  } catch (e) {
    console.error('[i18n] getLanguageHref error:', e)

    return
  }
}

export function changeLanguage(target: Locale): void {
  try {
    const href = getLanguageHref(target)

    if (!href) return
    window.location.replace(href)
  } catch (e) {
    console.error('[i18n] changeLanguage error:', e)

    return
  }
}

export function getLocale(pathname: string): Locale {
  return pathname.split('/')[1] as typeof i18nConfig.locales[number]
}