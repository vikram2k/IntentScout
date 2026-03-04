import { cn } from "@/common/utils/tailwind"
import { X } from "lucide-react"

interface ThemeTagProps {
  label: string
  onRemove: () => void
  colorIndex?: number
}

const TAG_COLORS = [
  "bg-violet-500/15 border-violet-500/30 text-violet-300 hover:border-violet-500/50",
  "bg-blue-500/15 border-blue-500/30 text-blue-300 hover:border-blue-500/50",
  "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50",
  "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:border-amber-500/50",
  "bg-pink-500/15 border-pink-500/30 text-pink-300 hover:border-pink-500/50",
  "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:border-cyan-500/50",
]

export default function ThemeTag({ label, onRemove, colorIndex = 0 }: ThemeTagProps) {
  const colorClass = TAG_COLORS[colorIndex % TAG_COLORS.length]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
        colorClass
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove theme: ${label}`}
        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  )
}
