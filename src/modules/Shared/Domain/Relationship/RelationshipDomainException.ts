import { DomainException } from '@/modules/Exceptions/Domain/DomainException.ts'

export class RelationshipDomainException extends DomainException {
  public static relationshipNotLoadedId = 'relationship_domain_relationship_not_loaded'
  public static relationshipCollectionNotLoadedId = 'relationship_domain_relationship_collection_not_loaded'

  public static relationshipNotLoaded (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Relationship is not loaded',
      this.relationshipNotLoadedId
    )
  }

  public static relationshipCollectionNotLoaded (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Relationship collection is not loaded',
      this.relationshipCollectionNotLoadedId
    )
  }
}