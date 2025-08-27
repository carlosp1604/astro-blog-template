import type { Locale } from '@/config/i18n.config.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import { CategoryModelTranslator } from '@/modules/Category/Infrastructure/CategoryModelTranslator.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
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
    * Get a Category (with parent and children) given its ID
    * @param id Category ID
    * @param locale Language in which Category entity must be translated
    * @return Category if found or null
    */
  public async getCategoryById(id: string, locale: Locale): Promise<Category | null> {
    const category = categories.find((category) => category.id === id)

    if (!category) {
      return null
    }

    const rawChildrenCategories: Array<CategoryRawModel> = categories
      .filter((child) => child.parentId === category.id && child.slugs[locale])
      .map((child) => {
        return {
          id: child.id,
          name: child.translations[locale].name,
          description: child.translations[locale].description,
          imageAltTitle: child.imageAltTitle[locale],
          postCount: null,
          slug: child.slugs[locale],
          imageUrl: child.imageUrl,
          parentId: child.parentId,
          parentCategory: undefined,
          childCategories: undefined,
        }
      })

    const parentCategory = categories.find((parent) => parent.id === category.parentId)

    let rawParentCategory: CategoryRawModel | undefined = undefined

    if (parentCategory && parentCategory.slugs[locale]) {
      rawParentCategory = {
        id: parentCategory.id,
        name: parentCategory.translations[locale].name,
        description: parentCategory.translations[locale].description,
        imageAltTitle: parentCategory.imageAltTitle[locale],
        postCount: null,
        slug: parentCategory.slugs[locale],
        imageUrl: parentCategory.imageUrl,
        parentId: parentCategory.parentId,
        parentCategory: undefined,
        childCategories: undefined,
      }
    }

    return CategoryModelTranslator.toDomain({
      id: category.id,
      name: category.translations[locale].name,
      description: category.translations[locale].description,
      imageAltTitle: category.imageAltTitle[locale],
      // FIXME: V1 -> Not optimized query
      postCount: articles.filter((article) => article.categories.includes(category.id)).length,
      slug: category.slugs[locale],
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
      .filter((category) => category.slugs[locale])
      .sort((a, b) => CollatorFactory.get(locale).compare(a.translations[locale].name, b.translations[locale].name))
      .map((category) => {
        return CategoryModelTranslator.toDomain({
          id: category.id,
          name: category.translations[locale].name,
          description: category.translations[locale].description,
          imageAltTitle: category.imageAltTitle[locale],
          // FIXME: V1 -> Not optimized query
          postCount: articles.filter((article) => article.categories.includes(category.id)).length,
          slug: category.slugs[locale],
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          parentCategory: undefined,
          childCategories: undefined,
        }, [])
      })
  }
}