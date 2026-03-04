export interface ExtractThemesResult {
  pageType: "PRODUCT" | "COLLECTION"
  themes: string[]
}

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

export interface GenerateFaqsResult {
  faqs: FaqItem[]
  contentGaps: ContentGapItem[]
}

export interface GenerateFaqsParams {
  pageType: "PRODUCT" | "COLLECTION"
  brandGuidelines: string
  pageText: string
  themes: string[]
  allQueries: string
}

export interface IAIClient {
  extractThemes(params: {
    url: string
    country: string
    pageText: string
  }): Promise<ExtractThemesResult>

  generateFaqs(params: GenerateFaqsParams): Promise<GenerateFaqsResult>
}
