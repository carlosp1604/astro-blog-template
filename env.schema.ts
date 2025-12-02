import { z } from 'zod'

const AssetPathSchema = z.union([
  z.url(),
  z.string()
    .startsWith('/', { message: 'Local path must start with \'/\'' })
    .refine((value) => !value.includes('..'), { message: 'Path cannot contain \'..\'' })
    .refine((val) => !/[<>:"|?*]/.test(val), { message: 'Local path contains invalid file system characters' })
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
