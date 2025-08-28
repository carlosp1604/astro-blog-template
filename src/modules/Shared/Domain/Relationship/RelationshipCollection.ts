import { RelationshipDomainException } from '@/modules/Shared/Domain/Relationship/RelationshipDomainException.ts'

export class RelationshipCollection<T> {
  private readonly instances: T[] | undefined

  private constructor(instances?: T[]) {
    this.instances = instances
  }

  /**
    * Create a loaded relationship collection given an array of items
    */
  static loaded<T>(items: T[]): RelationshipCollection<T> {
    return new RelationshipCollection<T>(items)
  }

  /**
    * Create a not loaded relationship collection
    */
  static notLoaded<T>(): RelationshipCollection<T> {
    return new RelationshipCollection<T>(undefined)
  }

  /**
    * Get relationship collection items or throw error if collection is not loaded
    */
  get values(): T[] {
    if (this.instances === undefined) {
      throw RelationshipDomainException.relationshipCollectionNotLoaded()
    }

    return this.instances
  }

  /**
    * Check if relationship collection is loaded
    */
  get isLoaded(): boolean {
    return this.instances !== undefined
  }
}
