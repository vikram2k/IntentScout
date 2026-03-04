import { errResponse, successResponse } from "@/common/response/helpers"
import { extractThemes } from "@/controllers/themes/controller"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ExtractThemesSchema } from "./types"

const router = new Hono()

router.post("/extract", zValidator("json", ExtractThemesSchema), async (c) => {
  const body = c.req.valid("json")
  const result = await extractThemes(body)
  return successResponse(c, result, 200)
})

export default router
