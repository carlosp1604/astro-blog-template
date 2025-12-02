import { ValueObject } from '@/modules/Shared/Domain/ValueObject/ValueObject.ts'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export abstract class Slug extends ValueObject<string> {
  public readonly MAX_LENGTH = 128

  protected isValidSlug(value: string): boolean {
    if (value.length > this.MAX_LENGTH) {
      return false
    }

    return SLUG_REGEX.test(value)
  }
}
