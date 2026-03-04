import { z } from "zod"

export const RunSerpResearchSchema = z.object({
  themes: z.string(), // JSON-encoded string[]
  url: z.string().url(),
  country: z.enum(["US", "IN", "UK", "CA", "AU"]),
  pageType: z.enum(["PRODUCT", "COLLECTION"]),
})
