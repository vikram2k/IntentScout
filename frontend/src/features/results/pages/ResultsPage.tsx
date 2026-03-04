import { cn } from "@/common/utils/tailwind"
import { useThemesStore } from "@/stores/themesStore"
import { ArrowLeft, Database, FileQuestion, MessageSquareText } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import ContentGapsTab from "../components/ContentGapsTab"
import ExportButton from "../components/ExportButton"
import FaqTab from "../components/FaqTab"
import ResultsSummary from "../components/ResultsSummary"
import SerpDataTab from "../components/SerpDataTab"

type Tab = "faqs" | "gaps" | "serp"

const TABS: { id: Tab; label: string; icon: typeof MessageSquareText }[] = [
  { id: "faqs", label: "Generated FAQs", icon: MessageSquareText },
  { id: "gaps", label: "Content Gaps", icon: FileQuestion },
  { id: "serp", label: "SERP Data", icon: Database },
]

export default function ResultsPage() {
  const navigate = useNavigate()
  const { themes, results } = useThemesStore()
  const [activeTab, setActiveTab] = useState<Tab>("faqs")

  // Redirect if no results
  useEffect(() => {
    if (!results) {
      navigate("/review", { replace: true })
    }
  }, [results, navigate])

  if (!results) return null

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/review")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to themes
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Research Results</h1>
            <p className="text-sm text-gray-500">
              AI-generated FAQs and content gaps based on real SERP data
            </p>
          </div>
          <ExportButton faqs={results.faqs} gaps={results.contentGaps} />
        </div>

        {/* Summary cards */}
        <ResultsSummary
          faqCount={results.faqs.length}
          gapCount={results.contentGaps.length}
          themeCount={themes.length}
        />

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px",
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    activeTab === tab.id
                      ? "bg-violet-500/15 text-violet-400"
                      : "bg-gray-800 text-gray-500"
                  )}
                >
                  {tab.id === "faqs"
                    ? results.faqs.length
                    : tab.id === "gaps"
                      ? results.contentGaps.length
                      : Object.keys(results.serpData).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "faqs" && <FaqTab faqs={results.faqs} />}
        {activeTab === "gaps" && <ContentGapsTab gaps={results.contentGaps} />}
        {activeTab === "serp" && <SerpDataTab serpData={results.serpData} />}
      </div>
    </div>
  )
}
