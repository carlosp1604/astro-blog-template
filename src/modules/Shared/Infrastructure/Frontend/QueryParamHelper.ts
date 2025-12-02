import { z, type ZodObject } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodSchema = ZodObject<any>

export class QueryParamHelper<T extends ZodSchema> {
  private schema: T
  private input: URLSearchParams
  private readonly defaults: z.infer<T>

  public shouldRedirect: boolean = false

  public values: z.infer<T>

  constructor(schema: T, searchParams: URLSearchParams) {
    this.schema = schema
    this.input = searchParams
    this.defaults = schema.parse({})
    this.values = { ...this.defaults }
  }

  public validate(): void {
    const shape = this.schema.shape
    const validatedKeys = new Set<string>()

    for (const key in shape) {
      const keySchema = shape[key]
      const rawValue = this.input.get(key)

      if (rawValue === null) {
        continue
      }

      const result = keySchema.safeParse(rawValue)

      if (!result.success) {
        this.shouldRedirect = true
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.values as any)[key] = result.data

        if (result.data === this.defaults[key]) {
          this.shouldRedirect = true
        }

        if (String(result.data) !== rawValue) {
          this.shouldRedirect = true
        }
      }
      validatedKeys.add(key)
    }

    for (const inputKey of this.input.keys()) {
      if (!validatedKeys.has(inputKey)) {
        this.shouldRedirect = true
        break
      }
    }
  }

  public toQueryString(): string {
    const params = new URLSearchParams()

    for (const key in this.values) {
      const value = this.values[key]
      const defaultValue = this.defaults[key]

      if (value !== defaultValue) {
        params.set(key, String(value))
      }
    }

    return params.toString()
  }
}
