import type { ContentGapItem, FaqItem } from "@/common/clients/ai/iAIClient"
import type { SerpResult } from "@/common/clients/serp/ISerpClient"

export interface RunSerpResearchInput {
  themes: string[]
  url: string
  country: string
  pageType: "PRODUCT" | "COLLECTION"
  brandGuidelinesText: string
}

export interface SerpResearchResult {
  faqs: FaqItem[]
  contentGaps: ContentGapItem[]
  serpData: Record<string, SerpResult>
}
