import { FileQuestion, MessageSquareText, Search } from "lucide-react"

interface ResultsSummaryProps {
  faqCount: number
  gapCount: number
  themeCount: number
}

export default function ResultsSummary({
  faqCount,
  gapCount,
  themeCount,
}: ResultsSummaryProps) {
  const stats = [
    {
      label: "FAQs Generated",
      value: faqCount,
      icon: MessageSquareText,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Content Gaps",
      value: gapCount,
      icon: FileQuestion,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Themes Analyzed",
      value: themeCount,
      icon: Search,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
        >
          <div
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-2 ${s.color}`}
          >
            <s.icon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
