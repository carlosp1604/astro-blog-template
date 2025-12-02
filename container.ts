import pino from 'pino'
import tagsData from '@/data/tags.json'
import articlesData from '@/data/articles.json'
import categoriesData from '@/data/categories.json'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { env } from '~/env.loader.ts'
import { GetTags } from '@/modules/Tag/Application/GetTags/GetTags.ts'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles'
import { GetTagBySlug } from '@/modules/Tag/Application/GetTagBySlug/GetTagBySlug.ts'
import { GetCategories } from '@/modules/Category/Application/GetCategories/GetCategories'
import { loggerOptions } from '~/pino.config.ts'
import { GetTagSlugsById } from '@/modules/Tag/Application/GetTagSlugsById/GetTagSlugsById.ts'
import { GetArticleBySlug } from '@/modules/Article/Application/GetArticleBySlug/GetArticleBySlug.ts'
import { i18nGlobalConfig } from '~/i18n.global.config.ts'
import { GetCategoryBySlug } from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlug.ts'
import { PinoLoggerService } from '@/modules/Shared/Infrastructure/PinoLoggerService.ts'
import { GetArticleSlugsById } from '@/modules/Article/Application/GetArticleSlugsById/GetArticleSlugsById.ts'
import { GetFeaturedArticles } from '@/modules/Article/Application/GetFeaturedArticles/GetFeaturedArticles.ts'
import { GetCategorySlugsById } from '@/modules/Category/Application/GetCategorySlugsById/GetCategorySlugsById.ts'
import { FileSystemTagRepository } from '@/modules/Tag/Infrastructure/FileSystemTagRepository.ts'
import { FileSystemArticleRepository } from '@/modules/Article/Infrastructure/FileSystemArticleRepository.ts'
import { FileSystemCategoryRepository } from '@/modules/Category/Infrastructure/FileSystemCategoryRepository'
import { ViteArticleContentRepository } from '@/modules/Article/Infrastructure/ViteArticleContentRepository.ts'
import { createContainer, asClass, Lifetime, asValue, asFunction } from 'awilix'
import type { TagJsonModel } from '@/modules/Tag/Infrastructure/TagJsonModel.ts'
import type { ArticleJsonModel } from '@/modules/Article/Infrastructure/ArticleJsonModel.ts'
import type { CategoryJsonModel } from '@/modules/Category/Infrastructure/CategoryJsonModel.ts'

const container = createContainer({
  injectionMode: 'CLASSIC'
})

container.register({
  /** Data **/
  articles: asFunction(() => {
    return articlesData as Array<ArticleJsonModel>
  }).setLifetime(Lifetime.SINGLETON),
  categories: asFunction(() => {
    return categoriesData as Array<CategoryJsonModel>
  }).setLifetime(Lifetime.SINGLETON),
  tags: asFunction(() => {
    return tagsData as Array<TagJsonModel>
  }).setLifetime(Lifetime.SINGLETON),

  /** Fuse **/
  articlesFuse: asFunction(() => {
    const options: IFuseOptions<ArticleJsonModel> = {
      keys: [ 'title', 'description' ],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true
    }

    return new Fuse(container.resolve('articles'), options)
  }).setLifetime(Lifetime.SINGLETON),

  /** Repositories, services, configuration **/
  articleRepository: asFunction(() => {
    return new FileSystemArticleRepository(
      container.resolve('articles'),
      container.resolve('categories'),
      container.resolve('tags'),
      container.resolve('articlesFuse')
    )
  }, { lifetime: Lifetime.SINGLETON }),
  articleContentRepository: asFunction(() => {
    return new ViteArticleContentRepository(container.resolve('loggerService'))
  }, { lifetime: Lifetime.SINGLETON }),
  categoryRepository: asFunction(() => {
    return new FileSystemCategoryRepository(
      container.resolve('articles'),
      container.resolve('categories')
    )
  }, { lifetime: Lifetime.SINGLETON }),
  tagRepository: asFunction(() => {
    return new FileSystemTagRepository(
      container.resolve('articles'),
      container.resolve('tags')
    )
  }, { lifetime: Lifetime.SINGLETON }),

  loggerService: asFunction(() => {
    return new PinoLoggerService(pino(loggerOptions))
  }),

  translationsConfig: asValue({
    locales: [ ...i18nGlobalConfig.locales ],
    defaultLocale: i18nGlobalConfig.defaultLocale
  }),
  paginationConfig: asValue({
    maxPageNumber: env.PAGINATION_MAX_PAGE_NUMBER,
    minPageNumber: env.PAGINATION_MIN_PAGE_NUMBER,
    maxPageSize: env.PAGINATION_MAX_PAGE_SIZE,
    minPageSize: env.PAGINATION_MIN_PAGE_SIZE
  }),

  /** Use-cases **/
  getArticles: asClass(GetArticles, { lifetime: Lifetime.SCOPED }),
  getFeaturedArticles: asClass(GetFeaturedArticles, { lifetime: Lifetime.SCOPED }),
  getArticleBySlug: asClass(GetArticleBySlug, { lifetime: Lifetime.SCOPED }),
  getArticleSlugsById: asClass(GetArticleSlugsById, { lifetime: Lifetime.SCOPED }),
  getCategories: asClass(GetCategories, { lifetime: Lifetime.SCOPED }),
  getCategoryBySlug: asClass(GetCategoryBySlug, { lifetime: Lifetime.SCOPED }),
  getCategorySlugsById: asClass(GetCategorySlugsById, { lifetime: Lifetime.SCOPED }),
  getTags: asClass(GetTags, { lifetime: Lifetime.SCOPED }),
  getTagBySlug: asClass(GetTagBySlug, { lifetime: Lifetime.SCOPED }),
  getTagSlugsById: asClass(GetTagSlugsById, { lifetime: Lifetime.SCOPED })
})

export default container
