import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import { CategoryModelTranslator } from '@/modules/Category/Infrastructure/CategoryModelTranslator.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import type { Locale, LocaleCode } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import articles from '~/data/articles.json'
import categories from '~/data/categories.json'

class CollatorFactory {
  private static cache = new Map<string, Intl.Collator>()

  static get(locale: string): Intl.Collator {
    if (!this.cache.has(locale)) {
      this.cache.set(locale, new Intl.Collator(locale, { sensitivity: 'base', ignorePunctuation: true }))
    }

    return this.cache.get(locale)!
  }
}

export class FileSystemCategoryRepository implements CategoryRepositoryInterface {
  /**
     * Get a Category (with parent and children) given its slug
     * @param slug Category slug
     * @param locale Language in which Category entity must be translated
     * @return Category if found or null
     */
  public async getCategoryBySlug(slug: string, locale: Locale): Promise<Category | null> {
    const category = categories.find((category) => {
      for (const translatedSlug of Object.values(category.slugs)) {
        if (translatedSlug === slug) {
          return true
        }
      }

      return false
    })

    if (!category) {
      return null
    }

    const rawChildrenCategories: Array<CategoryRawModel> = categories
      .filter((child) => child.parentId === category.id && child.slugs[locale.value])
      .map((child) => {
        return {
          id: child.id,
          name: child.translations[locale.value].name,
          description: child.translations[locale.value].description,
          imageAltTitle: child.imageAltTitle[locale.value],
          articlesCount: null,
          slug: child.slugs[locale.value],
          imageUrl: child.imageUrl,
          parentId: child.parentId,
          parentCategory: undefined,
          childCategories: undefined,
        }
      })

    const parentCategory = categories.find((parent) => parent.id === category.parentId)

    let rawParentCategory: CategoryRawModel | undefined = undefined

    if (parentCategory && parentCategory.slugs[locale.value]) {
      rawParentCategory = {
        id: parentCategory.id,
        name: parentCategory.translations[locale.value].name,
        description: parentCategory.translations[locale.value].description,
        imageAltTitle: parentCategory.imageAltTitle[locale.value],
        articlesCount: null,
        slug: parentCategory.slugs[locale.value],
        imageUrl: parentCategory.imageUrl,
        parentId: parentCategory.parentId,
        parentCategory: undefined,
        childCategories: undefined,
      }
    }

    return CategoryModelTranslator.toDomain({
      id: category.id,
      name: category.translations[locale.value].name,
      description: category.translations[locale.value].description,
      imageAltTitle: category.imageAltTitle[locale.value],
      // FIXME: V1 -> Not optimized query
      articlesCount: articles.filter((article) => article.categories.includes(category.id)).length,
      slug: category.slugs[locale.value],
      imageUrl: category.imageUrl,
      parentId: category.parentId,
      parentCategory: rawParentCategory,
      childCategories: rawChildrenCategories
    }, [ 'parentCategory', 'childrenCategories' ])
  }

  /**
    * Get all categories given a locale
    * @param locale Language in which Categories entities must be translated
    * @return Array of Category
    */
  public async getAllCategories(locale: Locale): Promise<Array<Category>> {
    return categories
      .filter((category) => category.slugs[locale.value])
      .sort((a, b) => CollatorFactory.get(locale.value).compare(a.translations[locale.value].name, b.translations[locale.value].name))
      .map((category) => {
        return CategoryModelTranslator.toDomain({
          id: category.id,
          name: category.translations[locale.value].name,
          description: category.translations[locale.value].description,
          imageAltTitle: category.imageAltTitle[locale.value],
          // FIXME: V1 -> Not optimized query
          articlesCount: articles.filter((article) => article.categories.includes(category.id)).length,
          slug: category.slugs[locale.value],
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          parentCategory: undefined,
          childCategories: undefined,
        }, [])
      })
  }

  /**
    * Get all slugs from a Category given its ID
    * @param id Category ID
    * @return Record<LocaleCode, string> or null if not found
    */
  public async getSlugsById(id: string): Promise<Record<LocaleCode, string> | null> {
    const category = categories.find((category) => category.id === id)

    if (!category) {
      return null
    }

    return category.slugs as Record<LocaleCode, string>
  }
}