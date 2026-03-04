export interface ExtractThemesInput {
  url: string
  country: string
}

export interface ExtractThemesResult {
  themes: string[]
  pageType: "PRODUCT" | "COLLECTION"
  url: string
  country: string
}
