export class GetArticleByIdApplicationError extends Error {
  public readonly id: string

  constructor(message: string, id: string) {
    super(message)
    this.id = id
  }

  public static notFoundId = 'get_article_by_id_article_not_found'

  public static notFound(articleId: string): GetArticleByIdApplicationError {
    return new GetArticleByIdApplicationError(
      `Article with ID ${articleId} was not found`,
      this.notFoundId
    )
  }
}