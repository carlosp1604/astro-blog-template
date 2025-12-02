export class GetTagsApplicationError extends Error {
  private readonly _brand!: void
  public readonly id: string

  public static internalErrorId = 'get_tags_internal_error'

  constructor(message: string, id: string) {
    super(message)
    this.id = id

    Object.setPrototypeOf(this, GetTagsApplicationError.prototype)
  }


  public static internalError(): GetTagsApplicationError {
    return new GetTagsApplicationError('Something went wrong while trying to retrieve tags', this.internalErrorId)
  }
}
