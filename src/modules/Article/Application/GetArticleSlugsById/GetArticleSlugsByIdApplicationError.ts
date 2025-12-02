export class GetArticleSlugsByIdApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_article_slugs_by_id_article_not_found'
  public static internalErrorId = 'get_article_slugs_by_id_internal_error'
  public static invalidArticleIdId = 'get_article_slugs_by_id_invalid_article_id'


  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetArticleSlugsByIdApplicationError.prototype)
  }

  public static notFound(articleId: string): GetArticleSlugsByIdApplicationError {
    return new GetArticleSlugsByIdApplicationError(
      `Cannot retrieve translated slugs. Article with ID ${articleId} was not found`,
      this.notFoundId
    )
  }

  public static internalError(articleId: string): GetArticleSlugsByIdApplicationError {
    return new GetArticleSlugsByIdApplicationError(
      `Something went wrong while trying to retrieve slugs for article with ID ${articleId}`,
      this.internalErrorId
    )
  }

  public static invalidArticleId(message: string): GetArticleSlugsByIdApplicationError {
    return new GetArticleSlugsByIdApplicationError(message, this.invalidArticleIdId)
  }
}
