export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse<E = { message: string }> {
  success: false
  data: E
}
