export class GetArticleBySlugApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_article_by_slug_article_not_found'
  public static internalErrorId = 'get_article_by_slug_internal_error'
  public static invalidArticleSlugId = 'get_article_by_slug_invalid_article_slug'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetArticleBySlugApplicationError.prototype)
  }

  public static notFound(slug: string): GetArticleBySlugApplicationError {
    return new GetArticleBySlugApplicationError(`Article with slug ${slug} was not found`, this.notFoundId)
  }

  public static internalError(articleId: string): GetArticleBySlugApplicationError {
    return new GetArticleBySlugApplicationError(
      `Something went wrong while trying to retrieve article with ID ${articleId}`,
      this.internalErrorId
    )
  }

  public static invalidArticleSlug(message: string): GetArticleBySlugApplicationError {
    return new GetArticleBySlugApplicationError(message, this.invalidArticleSlugId)
  }
}
