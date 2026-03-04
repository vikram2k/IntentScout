import { cn } from "@/common/utils/tailwind"
import { useRunSerpResearch } from "@/features/results/hooks/useRunSerpResearch"
import { useThemesStore } from "@/stores/themesStore"
import { ArrowLeft, Loader2, Plus, Search, Sparkles, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import BrandGuidelinesUpload from "../components/BrandGuidelinesUpload"
import ThemeTag from "../components/ThemeTag"

export default function ThemeReviewPage() {
  const navigate = useNavigate()
  const {
    url,
    country,
    themes,
    pageType,
    brandFile,
    addTheme,
    removeTheme,
    setBrandFile,
    setResults,
  } = useThemesStore()

  const [newTheme, setNewTheme] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [serpError, setSerpError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: runSerpResearch, isPending: isSerpPending } = useRunSerpResearch()

  // Redirect if no themes loaded (e.g. direct URL access)
  useEffect(() => {
    if (!url && themes.length === 0) {
      navigate("/", { replace: true })
    }
  }, [url, themes.length, navigate])

  const handleAddTheme = () => {
    const trimmed = newTheme.trim()
    if (!trimmed) return
    if (themes.includes(trimmed)) {
      setInputError("This theme already exists")
      return
    }
    addTheme(trimmed)
    setNewTheme("")
    setInputError(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTheme()
    }
  }

  const handleRunResearch = () => {
    setSerpError(null)

    if (themes.length === 0) {
      setSerpError("Add at least one theme before running research")
      return
    }

    runSerpResearch(
      {
        themes,
        url,
        country,
        pageType: pageType ?? "PRODUCT",
        brandFile,
      },
      {
        onSuccess: (data) => {
          setResults(data)
          navigate("/results")
        },
        onError: (err) => {
          setSerpError(
            err.message ?? "SERP research failed. Please try again."
          )
        },
      }
    )
  }

  // Derive a short display label from the URL
  const displayUrl = (() => {
    try {
      const u = new URL(url)
      return u.hostname + u.pathname
    } catch {
      return url
    }
  })()

  const countryFlag: Record<string, string> = {
    US: "🇺🇸",
    IN: "🇮🇳",
    UK: "🇬🇧",
    CA: "🇨🇦",
    AU: "🇦🇺",
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">
              Themes extracted
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Review Your Themes</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Search className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-sm">{displayUrl}</span>
            <span className="text-gray-700">·</span>
            <span>
              {countryFlag[country] ?? ""} {country}
            </span>
            {pageType && (
              <>
                <span className="text-gray-700">·</span>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
                    pageType === "PRODUCT"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  )}
                >
                  {pageType === "PRODUCT" ? "Product Page" : "Collection Page"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Themes Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-200">Search Themes</h2>
            <span className="text-xs text-gray-500">
              {themes.length} theme{themes.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Tags */}
          {themes.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {themes.map((theme, i) => (
                <ThemeTag
                  key={`${theme}-${i}`}
                  label={theme}
                  colorIndex={i}
                  onRemove={() => removeTheme(i)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic mb-4">
              No themes yet — add one below
            </p>
          )}

          {/* Add theme input */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTheme}
                  onChange={(e) => {
                    setNewTheme(e.target.value)
                    if (inputError) setInputError(null)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a theme (press Enter)"
                  className={cn(
                    "w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all",
                    inputError
                      ? "border-red-500/40"
                      : "border-gray-700 hover:border-gray-600"
                  )}
                  disabled={isSerpPending}
                />
              </div>
              <button
                type="button"
                onClick={handleAddTheme}
                disabled={!newTheme.trim() || isSerpPending}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  "bg-gray-800 border border-gray-700 text-gray-300",
                  "hover:bg-gray-700 hover:border-gray-600 hover:text-white",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                )}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {inputError && <p className="mt-1.5 text-xs text-red-400">{inputError}</p>}
          </div>
        </div>

        {/* Brand Guidelines Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-7 shadow-xl">
          <BrandGuidelinesUpload file={brandFile} onChange={setBrandFile} />
        </div>

        {/* Run SERP Research Button */}
        <button
          type="button"
          onClick={handleRunResearch}
          disabled={isSerpPending || themes.length === 0}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all",
            "bg-violet-600 hover:bg-violet-500 text-white",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          )}
        >
          {isSerpPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running SERP research…
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Run SERP Research
            </>
          )}
        </button>

        {isSerpPending && (
          <p className="text-center text-xs text-gray-500 mt-4">
            Fetching autocomplete, PAA & discussions for each theme, then generating FAQs — this
            may take 30–60 seconds
          </p>
        )}

        {serpError && (
          <p className="text-center text-sm text-red-400 mt-4">{serpError}</p>
        )}
      </div>
    </div>
  )
}
