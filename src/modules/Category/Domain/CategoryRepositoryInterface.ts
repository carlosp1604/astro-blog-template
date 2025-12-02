import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'
import type { CategorySlug } from '@/modules/Category/Domain/ValueObject/CategorySlug.ts'

export type CategoryRepositoryRelationshipOptions = 'childrenCategories' | 'parentCategory'

export interface CategoryRepositoryInterface {
  /**
    * Get a Category (with parent and children) given its slug
    * @param slug Category slug
    * @param locale Language in which Category entity must be translated
    * @return Category if found or null
    */
  getCategoryBySlug(slug: CategorySlug, locale: Locale): Promise<Category | null>

  /**
    * Get all Categories given a locale
    * @param locale Language in which Category entities must be translated
    * @return Array of Category
    */
  getAllCategories(locale: Locale): Promise<Array<Category>>

  /**
    * Get all slugs from a Category given its ID
    * @param id Category ID
    * @return Record<string, string> or null if not found
    */
  getSlugsById(id: CategoryId): Promise<Record<string, string> | null>
}
