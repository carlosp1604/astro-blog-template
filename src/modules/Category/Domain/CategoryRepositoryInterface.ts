import type { Locale } from '@/config/i18n.config.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'

export type CategoryRepositoryRelationshipOptions = 'childrenCategories' | 'parentCategory'

export interface CategoryRepositoryInterface {
  /**
    * Get a Category (with parent and children) given its ID
    * @param id Category ID
    * @param locale Language in which Category entity must be translated
    * @return Category if found or null
    */
  getCategoryById(id: string, locale: Locale): Promise<Category | null>

  /**
    * Get all categories given a locale
    * @param locale Language in which Categories entities must be translated
    * @return Array of Category
    */
  getAllCategories(locale: Locale): Promise<Array<Category>>
}