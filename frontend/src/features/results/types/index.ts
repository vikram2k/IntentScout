export interface FaqItem {
  question: string
  answer: string
  sourceQuery: string
}

export interface ContentGapItem {
  question: string
  gapType: string
  rationale: string
}

export interface SerpPaaItem {
  question: string
  snippet?: string
}

export interface SerpDiscussionItem {
  title: string
  link: string
  source: string
}

export interface SerpResult {
  autocomplete: string[]
  paa: SerpPaaItem[]
  discussions: SerpDiscussionItem[]
}

export interface SerpResearchResponse {
  faqs: FaqItem[]
  contentGaps: ContentGapItem[]
  serpData: Record<string, SerpResult>
}
