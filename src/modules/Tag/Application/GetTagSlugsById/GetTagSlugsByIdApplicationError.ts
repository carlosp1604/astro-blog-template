export class GetTagSlugsByIdApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static notFoundId = 'get_tag_slugs_by_id_tag_not_found'
  public static internalErrorId = 'get_tag_slugs_by_id_internal_error'
  public static invalidTagIdId = 'get_tag_slugs_by_id_invalid_tag_id'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetTagSlugsByIdApplicationError.prototype)
  }

  public static notFound(tagId: string): GetTagSlugsByIdApplicationError {
    return new GetTagSlugsByIdApplicationError(
      `Cannot retrieve translated slugs. Tag with ID ${tagId} was not found`,
      this.notFoundId
    )
  }

  public static internalError(tagId: string): GetTagSlugsByIdApplicationError {
    return new GetTagSlugsByIdApplicationError(
      `Something went wrong while trying to retrieve slugs for tag with ID ${tagId}`,
      this.internalErrorId
    )
  }

  public static invalidTagId(message: string): GetTagSlugsByIdApplicationError {
    return new GetTagSlugsByIdApplicationError(message, this.invalidTagIdId)
  }
}
