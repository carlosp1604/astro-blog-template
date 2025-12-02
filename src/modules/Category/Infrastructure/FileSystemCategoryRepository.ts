import { asSafeLocale } from '@/modules/Shared/Infrastructure/SafeLocale.ts'
import { CategoryModelTranslator } from '@/modules/Category/Infrastructure/CategoryModelTranslator.ts'
import type { Locale } from '@/modules/Shared/Domain/LocaleValueObject.ts'
import type { Category } from '@/modules/Category/Domain/Category.ts'
import type { ArticleJsonModel } from '@/modules/Article/Infrastructure/ArticleJsonModel.ts'
import type { CategoryRawModel } from '@/modules/Category/Infrastructure/CategoryRawModel.ts'
import type { CategoryJsonModel } from '@/modules/Category/Infrastructure/CategoryJsonModel.ts'
import type { CategoryRepositoryInterface } from '@/modules/Category/Domain/CategoryRepositoryInterface.ts'
import type { CategorySlug } from '@/modules/Category/Domain/ValueObject/CategorySlug.ts'
import type { CategoryId } from '@/modules/Category/Domain/ValueObject/CategoryId.ts'

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
  constructor(
    private readonly articles: Array<ArticleJsonModel>,
    private readonly categories: Array<CategoryJsonModel>
  ) {}
  /**
     * Get a Category (with parent and children) given its slug
     * @param slug Category slug
     * @param locale Language in which Category entity must be translated
     * @return Category if found or null
     */
  public async getCategoryBySlug(slug: CategorySlug, locale: Locale): Promise<Category | null> {
    const category = this.categories.find((category) => {
      for (const translatedSlug of Object.values(category.slugs)) {
        if (translatedSlug === slug.value) {
          return true
        }
      }

      return false
    })

    if (!category) {
      return null
    }

    const safeLocale = asSafeLocale(locale.value)

    const rawChildrenCategories: Array<CategoryRawModel> = this.categories
      .filter((child) => child.parentId === category.id && child.slugs[safeLocale])
      .map((child) => {
        return {
          id: child.id,
          name: child.translations[safeLocale].name,
          description: child.translations[safeLocale].description,
          imageAltTitle: child.imageAltTitle[safeLocale],
          articlesCount: null,
          slug: child.slugs[safeLocale],
          imageUrl: child.imageUrl,
          parentId: child.parentId,
          parentCategory: undefined,
          childCategories: undefined
        }
      })

    const parentCategory = this.categories.find((parent) => parent.id === category.parentId)

    let rawParentCategory: CategoryRawModel | undefined = undefined

    if (parentCategory && parentCategory.slugs[safeLocale]) {
      rawParentCategory = {
        id: parentCategory.id,
        name: parentCategory.translations[safeLocale].name,
        description: parentCategory.translations[safeLocale].description,
        imageAltTitle: parentCategory.imageAltTitle[safeLocale],
        articlesCount: null,
        slug: parentCategory.slugs[safeLocale],
        imageUrl: parentCategory.imageUrl,
        parentId: parentCategory.parentId,
        parentCategory: undefined,
        childCategories: undefined
      }
    }

    return CategoryModelTranslator.toDomain({
      id: category.id,
      name: category.translations[safeLocale].name,
      description: category.translations[safeLocale].description,
      imageAltTitle: category.imageAltTitle[safeLocale],
      // FIXME: V1 -> Not optimized query
      articlesCount: this.articles.filter((article) =>
        article.categories.includes(category.id) && article.locale === safeLocale).length,
      slug: category.slugs[safeLocale],
      imageUrl: category.imageUrl,
      parentId: category.parentId,
      parentCategory: rawParentCategory,
      childCategories: rawChildrenCategories
    }, [ 'parentCategory', 'childrenCategories' ])
  }

  /**
    * Get all Categories given a locale
    * @param locale Language in which Category entities must be translated
    * @return Array of Category
    */
  public async getAllCategories(locale: Locale): Promise<Array<Category>> {
    const safeLocale = asSafeLocale(locale.value)

    return this.categories
      .filter((category) => category.slugs[safeLocale])
      .sort((a, b) => CollatorFactory.get(locale.value).compare(a.translations[safeLocale].name, b.translations[safeLocale].name))
      .map((category) => {
        return CategoryModelTranslator.toDomain({
          id: category.id,
          name: category.translations[safeLocale].name,
          description: category.translations[safeLocale].description,
          imageAltTitle: category.imageAltTitle[safeLocale],
          // FIXME: V1 -> Not optimized query
          articlesCount: this.articles.filter((article) =>
            article.categories.includes(category.id) && article.locale === safeLocale).length,
          slug: category.slugs[safeLocale],
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          parentCategory: undefined,
          childCategories: undefined
        }, [])
      })
  }

  /**
    * Get all slugs from a Category given its ID
    * @param id Category ID
    * @return Record<string, string> or null if not found
    */
  public async getSlugsById(id: CategoryId): Promise<Record<string, string> | null> {
    const category = this.categories.find((category) => category.id === id.value)

    if (!category) {
      return null
    }

    return category.slugs as Record<string, string>
  }
}
