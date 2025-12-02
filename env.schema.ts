import path from 'path'
import { z } from 'zod'

const PROJECT_ROOT = process.cwd()
const DATA_SANDBOX_ROOT = path.join(PROJECT_ROOT, 'data')

const DataPathSchema = z
  .string()
  .min(1, 'Path must not be empty')
  .refine((value) => !value.includes('..'), { message: 'Path cannot contain \'..\'' })
  .refine((value) => !path.isAbsolute(value), { message: 'Path must be relative (start with ./ or just the name)' })
  .transform((value) => {
    return value.startsWith('./') ? value : `./${value}`
  })
  .refine(
    (value) => {
      const resolvedPath = path.resolve(PROJECT_ROOT, value)

      return resolvedPath.startsWith(DATA_SANDBOX_ROOT)
    },
    {
      message: 'Security Error: Data paths must be located inside the \'/data\' directory.'
    }
  )

const AssetPathSchema = z.union([
  z.url(),
  z.string()
    .startsWith('/', { message: 'Local path must start with \'/\'' })
    .refine((value) => !value.includes('..'), { message: 'Path cannot contain \'..\'' })
    .refine((val) => !/[<>:"|?*]/.test(val), { message: 'Local path contains invalid file system characters' })
    .refine(
      (value) => {
        const publicDir = path.join(PROJECT_ROOT, 'public')

        const relativeValue = value.startsWith('/') ? value.slice(1) : value

        const resolvedPath = path.resolve(publicDir, relativeValue)

        return resolvedPath.startsWith(publicDir)
      },
      { message: 'Path must resolve within the public directory' }
    )
    .default('')
])

export const EnvSchema = z
  .object({
    NODE_ENV: z.enum([ 'development', 'test', 'production' ]).default('development'),
    LOG_LEVEL: z.enum([ 'fatal', 'error', 'warn', 'info', 'debug', 'trace' ]).default('info'),

    PAGINATION_MAX_PAGE_NUMBER: z.union([
      z.literal('Infinity').transform(() => Infinity),
      z.coerce.number().int().positive()
    ]).default(Infinity),
    PAGINATION_MIN_PAGE_NUMBER: z.coerce.number().int().positive().default(1),
    PAGINATION_MAX_PAGE_SIZE: z.coerce.number().int().positive().default(60),
    PAGINATION_MIN_PAGE_SIZE: z.coerce.number().int().positive().default(12),

    PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(36),

    ARTICLES_DATA_PATH: DataPathSchema,
    CATEGORIES_DATA_PATH: DataPathSchema,
    TAGS_DATA_PATH: DataPathSchema,

    PUBLIC_SITE_BASE_URL: z.url().transform((url) => {
      return url.endsWith('/') ? url.slice(0, -1) : url
    }),
    PUBLIC_SITE_IMAGE_URL: AssetPathSchema,
    PUBLIC_SITE_NAME: z.string().trim().min(1, 'PUBLIC_SITE_NAME cannot be empty'),
    PUBLIC_SITE_LOGO_URL: AssetPathSchema
  })
  .transform((env) => ({
    ...env,
    isProduction: env.NODE_ENV === 'production'
  }))

export type Env = z.infer<typeof EnvSchema>
