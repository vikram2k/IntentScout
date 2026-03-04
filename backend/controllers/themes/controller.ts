import { createAIClient } from "@/common/clients/ai/factory"
import { createScraperClient } from "@/common/clients/scraper/factory"
import { HttpError } from "@/common/errors"
import type { ExtractThemesInput, ExtractThemesResult } from "./types"

export async function extractThemes(
  input: ExtractThemesInput
): Promise<ExtractThemesResult> {
  const { url, country } = input

  // Validate URL format
  try {
    new URL(url)
  } catch {
    throw new HttpError("Invalid URL provided", 400)
  }

  // Scrape the page
  const scraper = createScraperClient()
  const pageText = await scraper.scrape(url)

  if (!pageText || pageText.trim().length < 50) {
    throw new HttpError(
      "Could not extract enough content from the provided URL",
      422
    )
  }

  // Extract themes via AI
  const aiClient = createAIClient()
  const { themes, pageType } = await aiClient.extractThemes({ url, country, pageText })

  return { themes, pageType, url, country }
}
