import { z } from "zod"

export const ExtractThemesSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
  country: z.enum(["US", "IN", "UK", "CA", "AU"]),
})

export type ExtractThemesBody = z.infer<typeof ExtractThemesSchema>
