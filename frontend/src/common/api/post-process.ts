import type { ApiResponse } from "apisauce"
import { ApiError } from "./error"

export function checkUnauthorized<T>(response: ApiResponse<T>): T {
  if (!response.ok || response.data === undefined || response.data === null) {
    const data = response.data as { message?: string } | null
    const message = data?.message ?? response.problem ?? "Something went wrong"
    throw new ApiError(message, response.status ?? 500)
  }
  return response.data
}
