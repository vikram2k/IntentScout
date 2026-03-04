import { ChevronDown, ChevronUp, MessageSquareText } from "lucide-react"
import { useState } from "react"
import type { FaqItem } from "../types"

/**
 * Lightweight inline markdown → HTML for FAQ answers.
 * Supports: **bold**, *italic*, and `- ` bullet lists.
 */
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "• $1")
}

interface FaqTabProps {
  faqs: FaqItem[]
}

function FaqCard({ faq, index }: { faq: FaqItem; index: number }) {
  const [expanded, setExpanded] = useState(index < 3)

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-800/80 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-200 leading-relaxed">
          {faq.question}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pl-13">
          <div
            className="text-sm text-gray-400 leading-relaxed whitespace-pre-line pl-9 [&_strong]:text-gray-200 [&_strong]:font-semibold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(faq.answer) }}
          />
          <div className="mt-2.5 pl-9">
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-800 border border-gray-700 rounded px-2 py-0.5">
              Source: {faq.sourceQuery}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FaqTab({ faqs }: FaqTabProps) {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquareText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No FAQs were generated</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <FaqCard key={`${faq.question}-${i}`} faq={faq} index={i} />
      ))}
    </div>
  )
}
