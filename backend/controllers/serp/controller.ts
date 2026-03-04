import { createAIClient } from "@/common/clients/ai/factory"
import { createScraperClient } from "@/common/clients/scraper/factory"
import { createSerpClient } from "@/common/clients/serp/factory"
import { HttpError } from "@/common/errors"
import type { RunSerpResearchInput, SerpResearchResult } from "./types"

export async function runSerpResearch(
  input: RunSerpResearchInput
): Promise<SerpResearchResult> {
  const { themes, url, country, pageType, brandGuidelinesText } = input

  if (themes.length === 0) {
    throw new HttpError("At least one theme is required", 400)
  }

  // 1. Re-scrape the original page for full text
  const scraper = createScraperClient()
  const pageText = await scraper.scrape(url)

  if (!pageText || pageText.trim().length < 50) {
    throw new HttpError(
      "Could not extract enough content from the provided URL",
      422
    )
  }

  // 2. Fetch SERP data for themes sequentially to avoid rate limiting
  // (within each theme, autocomplete + PAA + discussions are still parallel)
  const serpClient = createSerpClient()
  const serpData: Record<string, Awaited<ReturnType<typeof serpClient.fetchAll>>> = {}

  for (const theme of themes) {
    serpData[theme] = await serpClient.fetchAll(theme, country)
    // Small pause between themes to stay within ScrapingDog's rate limit
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // 3. Collect all queries into a flat list for the AI prompt
  const allQueriesSet = new Set<string>()

  for (const theme of themes) {
    const data = serpData[theme]
    if (!data) continue

    for (const suggestion of data.autocomplete) {
      allQueriesSet.add(suggestion)
    }
    for (const paaItem of data.paa) {
      allQueriesSet.add(paaItem.question)
    }
    for (const disc of data.discussions) {
      allQueriesSet.add(disc.title)
    }
  }

  const allQueries = Array.from(allQueriesSet).join("\n")

  if (allQueriesSet.size === 0) {
    throw new HttpError(
      "No SERP data could be fetched for the provided themes. Try different themes.",
      422
    )
  }

  // 4. Generate FAQs via AI
  const aiClient = createAIClient()
  const { faqs, contentGaps } = await aiClient.generateFaqs({
    pageType,
    brandGuidelines: brandGuidelinesText,
    pageText,
    themes,
    allQueries,
  })

  return { faqs, contentGaps, serpData }
}
