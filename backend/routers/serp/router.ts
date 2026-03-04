import { createFileParser } from "@/common/clients/fileParser/factory"
import { HttpError } from "@/common/errors"
import { errResponse, successResponse } from "@/common/response/helpers"
import { runSerpResearch } from "@/controllers/serp/controller"
import { Hono } from "hono"

const router = new Hono()

router.post("/research", async (c) => {
  const body = await c.req.parseBody()

  // Extract fields
  const themesRaw = body.themes
  const url = body.url
  const country = body.country
  const pageType = body.pageType
  const brandFile = body.brandFile

  // Validate required fields
  if (
    typeof themesRaw !== "string" ||
    typeof url !== "string" ||
    typeof country !== "string" ||
    typeof pageType !== "string"
  ) {
    return errResponse(c, { message: "Missing required fields" }, 400)
  }

  // Parse themes JSON
  let themes: string[]
  try {
    themes = JSON.parse(themesRaw)
    if (!Array.isArray(themes) || themes.length === 0) {
      throw new Error("Empty themes")
    }
  } catch {
    return errResponse(c, { message: "Invalid themes format" }, 400)
  }

  // Validate country and pageType
  const validCountries = ["US", "IN", "UK", "CA", "AU"]
  const validPageTypes = ["PRODUCT", "COLLECTION"]

  if (!validCountries.includes(country)) {
    return errResponse(c, { message: "Invalid country" }, 400)
  }
  if (!validPageTypes.includes(pageType)) {
    return errResponse(c, { message: "Invalid page type" }, 400)
  }

  // Parse brand guidelines file if provided
  let brandGuidelinesText = ""
  if (brandFile && brandFile instanceof File) {
    const fileParser = createFileParser()
    const buffer = await brandFile.arrayBuffer()
    brandGuidelinesText = await fileParser.parseToText(buffer, brandFile.type)
  }

  const result = await runSerpResearch({
    themes,
    url,
    country,
    pageType: pageType as "PRODUCT" | "COLLECTION",
    brandGuidelinesText,
  })

  return successResponse(c, result, 200)
})

export default router
