import { env } from '~/env.loader.ts'
import type { LoggerOptions } from 'pino'

export const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL === 'info' && env.isProduction ? 'debug' : env.LOG_LEVEL,
  base: {
    pid: false,
    hostname: false
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  transport: env.isProduction
    ? undefined
    : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
}
