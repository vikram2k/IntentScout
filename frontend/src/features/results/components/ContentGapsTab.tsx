import { cn } from "@/common/utils/tailwind"
import { AlertTriangle } from "lucide-react"
import type { ContentGapItem } from "../types"

interface ContentGapsTabProps {
  gaps: ContentGapItem[]
}

const GAP_TYPE_COLORS: Record<string, string> = {
  "Feature Comparison": "bg-blue-500/10 border-blue-500/20 text-blue-400",
  "Pricing/Cost": "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  "Trust/Safety": "bg-amber-500/10 border-amber-500/20 text-amber-400",
  "How-to/Usage": "bg-violet-500/10 border-violet-500/20 text-violet-400",
  "General Detail": "bg-pink-500/10 border-pink-500/20 text-pink-400",
}

export default function ContentGapsTab({ gaps }: ContentGapsTabProps) {
  if (gaps.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No content gaps identified</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {gaps.map((gap, i) => (
        <div
          key={`${gap.question}-${i}`}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 mb-2">
                {gap.question}
              </p>
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-semibold uppercase tracking-wider border rounded px-2 py-0.5 mb-2",
                  GAP_TYPE_COLORS[gap.gapType] ??
                    "bg-gray-500/10 border-gray-500/20 text-gray-400"
                )}
              >
                {gap.gapType}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                {gap.rationale}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
