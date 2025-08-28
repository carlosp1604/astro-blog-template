export class GetCategorySlugsByIdApplicationError extends Error {
  public readonly id: string

  constructor(message: string, id: string) {
    super(message)
    this.id = id
  }

  public static notFoundId = 'get_category_slugs_by_id_category_not_found'

  public static notFound(categoryId: string): GetCategorySlugsByIdApplicationError {
    return new GetCategorySlugsByIdApplicationError(
      `Cannot retrieve translated slugs. Category with ID ${categoryId} was not found`,
      this.notFoundId
    )
  }
}