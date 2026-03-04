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

export interface ISerpClient {
  fetchAutocomplete(query: string, country: string): Promise<string[]>
  fetchPaa(query: string, country: string): Promise<SerpPaaItem[]>
  fetchDiscussions(query: string, country: string): Promise<SerpDiscussionItem[]>
  fetchAll(query: string, country: string): Promise<SerpResult>
}
