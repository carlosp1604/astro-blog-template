import { ValueObject } from '@/modules/Shared/Domain/ValueObject/ValueObject.ts'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export abstract class Id extends ValueObject<string> {
  protected isValidId(value: string): boolean {
    return UUID_REGEX.test(value)
  }
}
