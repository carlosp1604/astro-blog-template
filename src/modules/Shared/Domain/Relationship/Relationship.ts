import { RelationshipDomainException } from '@/modules/Shared/Domain/Relationship/RelationshipDomainException.ts'

export class Relationship<T> {
  private readonly instance: T | undefined

  private constructor(instance?: T) {
    this.instance = instance
  }

  /**
    * Created a loaded relationship given a related object
    */
  static loaded<T>(relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject)
  }

  /**
    * Create a not loaded relationship
    */
  static notLoaded<T>(): Relationship<T> {
    return new Relationship<T>(undefined)
  }

  /**
    * Return value if loaded or throw error
    */
  get value(): T {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationshipNotLoaded()
    }

    return this.instance
  }

  /**
    * Check if relationship is loaded
    */
  get isLoaded(): boolean {
    return this.instance !== undefined
  }
}
