import { settings } from "@/common/config/settings"
import type { IAIClient } from "./iAIClient"
import { AnthropicClient } from "./openAIClient"

export const createAIClient = (): IAIClient => {
  return new AnthropicClient(settings.anthropic.apiKey, settings.anthropic.model)
}
