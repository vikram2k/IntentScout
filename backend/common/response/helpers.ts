import type { Context } from "hono"

export function successResponse<T>(c: Context, data: T, status: number = 200) {
  return c.json({ success: true, data }, status as 200)
}

export function errResponse<E = { message: string }>(
  c: Context,
  data: E,
  status: number = 400
) {
  return c.json({ success: false, data }, status as 400)
}
