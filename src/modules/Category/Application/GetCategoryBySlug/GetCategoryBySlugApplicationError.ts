export class GetCategoryBySlugApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_category_by_slug_category_not_found'
  public static internalErrorId = 'get_category_by_slug_internal_error'
  public static invalidCategorySlugId = 'get_category_by_slug_invalid_category_slug'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetCategoryBySlugApplicationError.prototype)
  }

  public static notFound(slug: string): GetCategoryBySlugApplicationError {
    return new GetCategoryBySlugApplicationError(`Category with slug ${slug} was not found`, this.notFoundId)
  }

  public static internalError(categorySlug: string): GetCategoryBySlugApplicationError {
    return new GetCategoryBySlugApplicationError(
      `Something went wrong while trying to retrieve category with slug ${categorySlug}`,
      this.internalErrorId
    )
  }

  public static invalidCategorySlug(message: string): GetCategoryBySlugApplicationError {
    return new GetCategoryBySlugApplicationError(message, this.invalidCategorySlugId)
  }
}
