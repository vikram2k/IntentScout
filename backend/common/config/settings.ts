const env = (key: string): string | undefined => process.env[key]

function required(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing required config: ${key}`)
  return v
}

export const settings = {
  server: {
    port: Number(env("PORT")) || 8000,
    corsOrigin: env("CORS_ORIGIN") ?? "http://localhost:5173",
    isProduction: env("NODE_ENV") === "production",
  },
  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
    model: env("ANTHROPIC_MODEL") ?? "claude-sonnet-4-5",
  },
  scrapingDog: {
    apiKey: required("SCRAPINGDOG_API_KEY"),
  },
}
