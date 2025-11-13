export class GetCategoryBySlugApplicationError extends Error {
  public readonly id: string

  constructor(message: string, id: string) {
    super(message)
    this.id = id
  }

  public static notFoundId = 'get_category_by_slug_category_not_found'

  public static notFound(slug: string): GetCategoryBySlugApplicationError {
    return new GetCategoryBySlugApplicationError(
      `Category with slug ${slug} was not found`,
      this.notFoundId
    )
  }
}