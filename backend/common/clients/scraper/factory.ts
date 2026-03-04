import { settings } from "@/common/config/settings"
import type { IScraperClient } from "./IScraperClient"
import { ScrapingDogClient } from "./scraperClient"

export const createScraperClient = (): IScraperClient => {
  return new ScrapingDogClient(settings.scrapingDog.apiKey)
}
