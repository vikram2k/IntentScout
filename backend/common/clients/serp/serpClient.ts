import { HttpError } from "@/common/errors"
import type {
  ISerpClient,
  SerpDiscussionItem,
  SerpPaaItem,
  SerpResult,
} from "./ISerpClient"

// Map our country codes to ScrapingDog country codes
const COUNTRY_MAP: Record<string, string> = {
  US: "us",
  IN: "in",
  UK: "gb",
  CA: "ca",
  AU: "au",
}

export class ScrapingDogSerpClient implements ISerpClient {
  constructor(private readonly apiKey: string) {}

  private countryCode(country: string): string {
    return COUNTRY_MAP[country] ?? "us"
  }

  async fetchAutocomplete(query: string, country: string): Promise<string[]> {
    const cc = this.countryCode(country)
    const url = `https://api.scrapingdog.com/google_autocomplete?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&country=${cc}`

    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`Autocomplete failed for "${query}": ${res.status}`)
        return []
      }
      const data = await res.json()

      // ScrapingDog autocomplete returns array of suggestion objects
      if (Array.isArray(data)) {
        return data
          .map((item: { query?: string; value?: string }) => item.query ?? item.value ?? "")
          .filter((s: string) => s.length > 0)
          .slice(0, 10)
      }

      // Some responses wrap in a suggestions array
      if (data.suggestions && Array.isArray(data.suggestions)) {
        return data.suggestions
          .map((s: string | { query?: string; value?: string }) =>
            typeof s === "string" ? s : (s.query ?? s.value ?? "")
          )
          .filter((s: string) => s.length > 0)
          .slice(0, 10)
      }

      return []
    } catch (err) {
      console.error(`Autocomplete error for "${query}":`, err)
      return []
    }
  }

  async fetchPaa(query: string, country: string): Promise<SerpPaaItem[]> {
    const cc = this.countryCode(country)
    const url = `https://api.scrapingdog.com/google?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&country=${cc}&results=10`

    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`SERP failed for "${query}": ${res.status}`)
        return []
      }
      const data = await res.json()

      // Extract People Also Ask — ScrapingDog uses several possible field names
      const paa: SerpPaaItem[] = []

      const paaSource =
        data.peopleAlsoAskedFor ??
        data.people_also_ask ??
        data.related_questions ??
        []

      if (Array.isArray(paaSource)) {
        for (const item of paaSource) {
          if (item.question) {
            paa.push({
              question: item.question,
              snippet: item.answers ?? item.snippet ?? item.answer ?? undefined,
            })
          }
        }
      }

      return paa.slice(0, 10)
    } catch (err) {
      console.error(`PAA error for "${query}":`, err)
      return []
    }
  }

  async fetchDiscussions(
    query: string,
    country: string
  ): Promise<SerpDiscussionItem[]> {
    const cc = this.countryCode(country)
    const discussionQuery = `${query} site:reddit.com OR site:quora.com`
    const url = `https://api.scrapingdog.com/google?api_key=${this.apiKey}&query=${encodeURIComponent(discussionQuery)}&country=${cc}&results=10`

    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`Discussions failed for "${query}": ${res.status}`)
        return []
      }
      const data = await res.json()

      const discussions: SerpDiscussionItem[] = []

      // Extract from organic results
      const organicResults = data.organic_results ?? data.organic_data ?? []
      if (Array.isArray(organicResults)) {
        for (const item of organicResults) {
          const link = item.link ?? item.url ?? ""
          const title = item.title ?? ""

          if (!link || !title) continue

          let source = "other"
          if (link.includes("reddit.com")) source = "reddit"
          else if (link.includes("quora.com")) source = "quora"
          else if (link.includes("facebook.com")) source = "facebook"

          if (source !== "other") {
            discussions.push({ title, link, source })
          }
        }
      }

      return discussions.slice(0, 8)
    } catch (err) {
      console.error(`Discussions error for "${query}":`, err)
      return []
    }
  }

  async fetchAll(query: string, country: string): Promise<SerpResult> {
    const [autocomplete, paa, discussions] = await Promise.all([
      this.fetchAutocomplete(query, country),
      this.fetchPaa(query, country),
      this.fetchDiscussions(query, country),
    ])

    return { autocomplete, paa, discussions }
  }
}
