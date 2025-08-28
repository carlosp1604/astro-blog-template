export class GetCategoryByIdApplicationError extends Error {
  public readonly id: string

  constructor(message: string, id: string) {
    super(message)
    this.id = id
  }

  public static notFoundId = 'get_category_by_id_category_not_found'

  public static notFound(categoryId: string): GetCategoryByIdApplicationError {
    return new GetCategoryByIdApplicationError(
      `Category with ID ${categoryId} was not found`,
      this.notFoundId
    )
  }
}