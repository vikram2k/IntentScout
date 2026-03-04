import { cn } from "@/common/utils/tailwind"
import { useThemesStore } from "@/stores/themesStore"
import { Globe, Loader2, Search, Sparkles } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useExtractThemes } from "../hooks/useExtractThemes"

const COUNTRIES = [
  { value: "US", label: "🇺🇸 United States" },
  { value: "IN", label: "🇮🇳 India" },
  { value: "UK", label: "🇬🇧 United Kingdom" },
  { value: "CA", label: "🇨🇦 Canada" },
  { value: "AU", label: "🇦🇺 Australia" },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { setExtractResult } = useThemesStore()

  const [url, setUrl] = useState("")
  const [country, setCountry] = useState("US")
  const [error, setError] = useState<string | null>(null)

  const { mutate: extractThemes, isPending } = useExtractThemes()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    try {
      new URL(url.trim())
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com/product)")
      return
    }

    extractThemes(
      { url: url.trim(), country },
      {
        onSuccess: (data) => {
          setExtractResult(data.url, data.country, data.themes, data.pageType)
          navigate("/review")
        },
        onError: (err) => {
          setError(err.message ?? "Failed to extract themes. Please try again.")
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-3">
            Intent<span className="text-violet-400">Scout</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Turn any product page into SEO-ready FAQs and content insights — powered by real search intent data
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl"
        >
          {/* URL Input */}
          <div className="mb-5">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Product or Collection Page URL
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="https://yourstore.com/products/your-product"
                className={cn(
                  "w-full bg-gray-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all",
                  error
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-gray-700 hover:border-gray-600"
                )}
                disabled={isPending}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Country Selector */}
          <div className="mb-7">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <Globe className="inline w-3.5 h-3.5 mr-1.5 text-gray-400" />
              Target Market
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
              disabled={isPending}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all",
              "bg-violet-600 hover:bg-violet-500 text-white",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting themes…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Extract Themes
              </>
            )}
          </button>

          {isPending && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Scraping page and analysing with AI — this may take a few seconds
            </p>
          )}
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Supports product pages and collection/category pages
        </p>
      </div>
    </div>
  )
}
