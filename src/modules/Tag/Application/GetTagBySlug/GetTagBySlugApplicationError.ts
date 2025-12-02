export class GetTagBySlugApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_tag_by_slug_tag_not_found'
  public static internalErrorId = 'get_tag_by_slug_internal_error'
  public static invalidTagSlugId = 'get_tag_by_slug_invalid_tag_slug'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetTagBySlugApplicationError.prototype)
  }

  public static notFound(slug: string): GetTagBySlugApplicationError {
    return new GetTagBySlugApplicationError(`Tag with slug ${slug} was not found`, this.notFoundId)
  }

  public static internalError(tagSlug: string): GetTagBySlugApplicationError {
    return new GetTagBySlugApplicationError(
      `Something went wrong while trying to retrieve tag with slug ${tagSlug}`,
      this.internalErrorId
    )
  }

  public static invalidTagSlug(message: string): GetTagBySlugApplicationError {
    return new GetTagBySlugApplicationError(message, this.invalidTagSlugId)
  }
}
