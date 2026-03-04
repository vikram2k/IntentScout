import { create } from "apisauce"
import { BASE_URL } from "./constants"

export const api = create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json; charset=utf-8" },
})

// Unwrap { success: true, data: T } → T for every successful response
api.addResponseTransform((response) => {
  if (
    response.ok &&
    response.data !== null &&
    typeof response.data === "object" &&
    "success" in response.data &&
    "data" in response.data
  ) {
    response.data = (response.data as { data: unknown }).data
  }
})

export const get = async <T>(
  url: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>
) => api.get<T>(url, params, { headers })

export const post = async <T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>
) => api.post<T>(url, data, { headers })

export const put = async <T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>
) => api.put<T>(url, data, { headers })

export const del = async <T>(
  url: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>
) => api.delete<T>(url, params, { headers })
