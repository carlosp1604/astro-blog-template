export class GetArticlesApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static internalErrorId = 'get_articles_internal_error'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetArticlesApplicationError.prototype)
  }

  public static internalError(): GetArticlesApplicationError {
    return new GetArticlesApplicationError('Something went wrong while trying to retrieve articles', this.internalErrorId)
  }
}
