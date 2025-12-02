import { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Tag } from '@/modules/Tag/Domain/Tag.ts'
import type { TagId } from '@/modules/Tag/Domain/ValueObject/TagId.ts'
import type { TagSlug } from '@/modules/Tag/Domain/ValueObject/TagSlug.ts'

export interface TagRepositoryInterface {
  /**
   * Get a Tag given its slug
   * @param slug Tag slug
   * @param locale Language in which Tag entity must be translated
   * @return Tag if found or null
   */
  getTagBySlug(slug: TagSlug, locale: Locale): Promise<Tag | null>

  /**
   * Get all Tags given a locale
   * @param locale Language in which Tag entities must be translated
   * @return Array of Tag
   */
  getAllTags(locale: Locale): Promise<Array<Tag>>

  /**
   * Get all slugs from a Tag given its ID
   * @param id Tag ID
   * @return Record<string, string> or null if not found
   */
  getSlugsById(id: TagId): Promise<Record<string, string> | null>
}
