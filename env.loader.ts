import { z } from 'zod'
import { config } from 'dotenv'
import { resolve } from 'path'
import { EnvSchema } from './env.schema'
import type { Env } from './env.schema'

export function loadEnvFile(): void {
  const nodeEnv = process.env.NODE_ENV || 'development'

  const projectRoot = process.cwd()

  const basePath = resolve(projectRoot, '.env')

  config({ path: basePath })

  if (nodeEnv !== 'production') {
    const envFilePath = resolve(projectRoot, `.env.${nodeEnv}`)

    config({ path: envFilePath, override: true })
  }
}

loadEnvFile()

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', z.flattenError(parsedEnv.error))
  throw new Error('Invalid environment variables')
}

export const env: Env = parsedEnv.data
