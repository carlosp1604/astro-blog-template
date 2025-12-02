import type { APIContext } from 'astro'
import { env } from '~/env.loader'

export const prerender = true

export function GET(context: APIContext) {
  const siteBaseUrl = env.PUBLIC_SITE_BASE_URL

  const disallowPaths = [
    '/404/',
    '/500/'
  ]

  const robotsTxt = `
User-agent: *
Allow: /
${disallowPaths.map(path => `Disallow: ${path}`).join('\n')}

# Sitemaps
Sitemap: ${siteBaseUrl}/sitemap-index.xml
`.trim()

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}
