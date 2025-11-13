import { createContainer, asClass, Lifetime, asFunction } from 'awilix'
import { GetArticles } from '@/modules/Article/Application/GetArticles/GetArticles'
import { FileSystemArticleRepository } from '@/modules/Article/Infrastructure/FileSystemArticleRepository'
import { GetCategories } from '@/modules/Category/Application/GetCategories/GetCategories'
import { GetCategoryBySlug } from '@/modules/Category/Application/GetCategoryBySlug/GetCategoryBySlug.ts'
import { FileSystemCategoryRepository } from '@/modules/Category/Infrastructure/FileSystemCategoryRepository'

const container = createContainer({
  injectionMode: 'CLASSIC',
})

container.register({
  articleRepository: asClass(FileSystemArticleRepository, { lifetime: Lifetime.SINGLETON }),
  categoryRepository: asClass(FileSystemCategoryRepository, { lifetime: Lifetime.SINGLETON }),

  getArticles: asFunction(() => {
    return new GetArticles(
      container.resolve('articleRepository'),
      Infinity,
      1,
      12,
      1,
    )
  }, { lifetime: Lifetime.SCOPED }),
  getCategories: asClass(GetCategories, { lifetime: Lifetime.SCOPED }),
  getCategoryBySlug: asClass(GetCategoryBySlug, { lifetime: Lifetime.SCOPED }),
})

export default container
