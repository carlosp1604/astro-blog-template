export class GetCategoriesApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static internalErrorId = 'get_categories_internal_error'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetCategoriesApplicationError.prototype)
  }

  public static internalError(): GetCategoriesApplicationError {
    return new GetCategoriesApplicationError('Something went wrong while trying to retrieve categories', this.internalErrorId)
  }
}
