export class GetCategorySlugsByIdApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_category_slugs_by_id_category_not_found'
  public static internalErrorId = 'get_category_slugs_by_id_internal_error'
  public static invalidCategoryIdId = 'get_category_slugs_by_id_invalid_category_id'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetCategorySlugsByIdApplicationError.prototype)
  }

  public static notFound(categoryId: string): GetCategorySlugsByIdApplicationError {
    return new GetCategorySlugsByIdApplicationError(
      `Cannot retrieve translated slugs. Category with ID ${categoryId} was not found`,
      this.notFoundId
    )
  }

  public static internalError(categoryId: string): GetCategorySlugsByIdApplicationError {
    return new GetCategorySlugsByIdApplicationError(
      `Something went wrong while trying to retrieve slugs for category with ID ${categoryId}`,
      this.internalErrorId
    )
  }

  public static invalidCategoryId(message: string): GetCategorySlugsByIdApplicationError {
    return new GetCategorySlugsByIdApplicationError(message, this.invalidCategoryIdId)
  }
}
