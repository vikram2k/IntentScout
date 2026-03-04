import { cn } from "@/common/utils/tailwind"
import { ExternalLink, MessageCircle, Search, Sparkles } from "lucide-react"
import { useState } from "react"
import type { SerpResult } from "../types"

interface SerpDataTabProps {
  serpData: Record<string, SerpResult>
}

export default function SerpDataTab({ serpData }: SerpDataTabProps) {
  const themes = Object.keys(serpData)
  const [activeTheme, setActiveTheme] = useState(themes[0] ?? "")

  if (themes.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No SERP data available</p>
      </div>
    )
  }

  const data = serpData[activeTheme]

  return (
    <div>
      {/* Theme selector pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => setActiveTheme(theme)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              activeTheme === theme
                ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600"
            )}
          >
            {theme}
          </button>
        ))}
      </div>

      {data && (
        <div className="space-y-5">
          {/* Autocomplete */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Autocomplete Suggestions
              <span className="text-xs font-normal text-gray-500">
                ({data.autocomplete.length})
              </span>
            </h3>
            {data.autocomplete.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.autocomplete.map((suggestion, i) => (
                  <span
                    key={`${suggestion}-${i}`}
                    className="bg-gray-900 border border-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No autocomplete data</p>
            )}
          </div>

          {/* PAA */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              People Also Ask
              <span className="text-xs font-normal text-gray-500">
                ({data.paa.length})
              </span>
            </h3>
            {data.paa.length > 0 ? (
              <ul className="space-y-2">
                {data.paa.map((item, i) => (
                  <li
                    key={`${item.question}-${i}`}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-gray-600 flex-shrink-0 mt-0.5">•</span>
                    <span>{item.question}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-600 italic">No PAA data</p>
            )}
          </div>

          {/* Discussions */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Discussion & Forums
              <span className="text-xs font-normal text-gray-500">
                ({data.discussions.length})
              </span>
            </h3>
            {data.discussions.length > 0 ? (
              <ul className="space-y-2.5">
                {data.discussions.map((item, i) => (
                  <li key={`${item.link}-${i}`} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex-shrink-0 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border mt-0.5",
                        item.source === "reddit"
                          ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                          : item.source === "quora"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      )}
                    >
                      {item.source}
                    </span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 hover:text-violet-400 transition-colors leading-relaxed"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-600 italic">No discussions found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
