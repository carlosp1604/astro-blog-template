import { EnvSchema } from './env.schema'
import type { Env } from './env.schema'
import { z } from 'zod'

const loadedEnv = {
  NODE_ENV: import.meta.env.NODE_ENV,
  LOG_LEVEL: import.meta.env.LOG_LEVEL,

  PAGINATION_MAX_PAGE_NUMBER: import.meta.env.PAGINATION_MAX_PAGE_NUMBER,
  PAGINATION_MIN_PAGE_NUMBER: import.meta.env.PAGINATION_MIN_PAGE_NUMBER,
  PAGINATION_MAX_PAGE_SIZE: import.meta.env.PAGINATION_MAX_PAGE_SIZE,
  PAGINATION_MIN_PAGE_SIZE: import.meta.env.PAGINATION_MIN_PAGE_SIZE,

  PUBLIC_DEFAULT_PAGE_SIZE: import.meta.env.PUBLIC_DEFAULT_PAGE_SIZE,
  PUBLIC_SITE_BASE_URL: import.meta.env.PUBLIC_SITE_BASE_URL,
  PUBLIC_SITE_NAME: import.meta.env.PUBLIC_SITE_NAME,
  PUBLIC_SITE_IMAGE_URL: import.meta.env.PUBLIC_SITE_IMAGE_URL,
  PUBLIC_SITE_LOGO_URL: import.meta.env.PUBLIC_SITE_LOGO_URL
}

const parsedEnv = EnvSchema.safeParse(loadedEnv)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', z.flattenError(parsedEnv.error))
  throw new Error('Invalid environment variables')
}

export const env: Env = parsedEnv.data
