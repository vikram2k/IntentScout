import { HttpError } from "@/common/errors"
import type { IScraperClient } from "./IScraperClient"

const MAX_TEXT_LENGTH = 8000

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LENGTH)
}

export class ScrapingDogClient implements IScraperClient {
  constructor(private readonly apiKey: string) {}

  async scrape(url: string): Promise<string> {
    const endpoint = `https://api.scrapingdog.com/scrape?api_key=${this.apiKey}&url=${encodeURIComponent(url)}&dynamic=false`

    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new HttpError(
        `Scraping failed: ${response.status} ${response.statusText}`,
        502
      )
    }

    const html = await response.text()

    if (!html || html.trim().length === 0) {
      throw new HttpError("No content returned from URL", 422)
    }

    return stripHtml(html)
  }
}
