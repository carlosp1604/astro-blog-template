export class GetFeaturedArticlesApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static internalErrorId = 'get_featured_articles_internal_error'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetFeaturedArticlesApplicationError.prototype)
  }

  public static internalError(): GetFeaturedArticlesApplicationError {
    return new GetFeaturedArticlesApplicationError(
      'Something went wrong while trying to retrieve featured articles',
      this.internalErrorId
    )
  }
}
