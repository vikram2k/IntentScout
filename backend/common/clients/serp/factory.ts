import { settings } from "@/common/config/settings"
import type { ISerpClient } from "./ISerpClient"
import { ScrapingDogSerpClient } from "./serpClient"

export const createSerpClient = (): ISerpClient => {
  return new ScrapingDogSerpClient(settings.scrapingDog.apiKey)
}
