export class GetArticleSlugsByIdApplicationError extends Error {
  public readonly id: string

  constructor(message: string, id: string) {
    super(message)
    this.id = id
  }

  public static notFoundId = 'get_article_slugs_by_id_article_not_found'

  public static notFound(articleId: string): GetArticleSlugsByIdApplicationError {
    return new GetArticleSlugsByIdApplicationError(
      `Cannot retrieve translated slugs. Article with ID ${articleId} was not found`,
      this.notFoundId
    )
  }
}