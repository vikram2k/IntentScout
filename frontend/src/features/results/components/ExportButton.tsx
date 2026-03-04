import { useThemesStore } from "@/stores/themesStore"
import {
  AlignLeft,
  ChevronDown,
  FileText,
  Loader2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ContentGapItem, FaqItem } from "../types"

interface ExportButtonProps {
  faqs: FaqItem[]
  gaps: ContentGapItem[]
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^• /gm, "- ")
}

// ── PDF via print window ─────────────────────────────────────────────────────

function buildPrintHtml(
  faqs: FaqItem[],
  gaps: ContentGapItem[],
  url: string,
  themes: string[]
): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const faqRows = faqs
    .map(
      (faq, i) => `
      <div class="item">
        <p class="q"><span class="num">${i + 1}.</span> ${faq.question}</p>
        <p class="a">${stripMarkdown(faq.answer)}</p>
        <p class="src">Source: ${faq.sourceQuery}</p>
      </div>`
    )
    .join("")

  const gapRows = gaps
    .map(
      (gap, i) => `
      <div class="item">
        <p class="q"><span class="num">${i + 1}.</span> ${gap.question}</p>
        <p class="badge">${gap.gapType}</p>
        <p class="a">${gap.rationale}</p>
      </div>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>IntentScout Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; font-size: 13px; color: #1a1a1a; padding: 48px 56px; line-height: 1.6; }
  h1 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .meta { font-size: 11px; color: #666; margin-bottom: 4px; }
  .themes { font-size: 11px; color: #666; margin-bottom: 24px; }
  hr { border: none; border-top: 1px solid #e0e0e0; margin: 24px 0; }
  h2 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; border-left: 3px solid #7c3aed; padding-left: 10px; }
  .item { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f0f0f0; }
  .item:last-child { border-bottom: none; }
  .num { color: #7c3aed; font-weight: 700; }
  .q { font-weight: 600; font-size: 13px; color: #1a1a1a; margin-bottom: 5px; }
  .a { font-size: 12px; color: #444; line-height: 1.65; margin-bottom: 4px; }
  .src { font-size: 10px; color: #999; font-style: italic; }
  .badge { display: inline-block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #f3f0ff; color: #7c3aed; border: 1px solid #ddd6fe; border-radius: 4px; padding: 1px 7px; margin-bottom: 4px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>IntentScout Research Report</h1>
  <p class="meta">URL: ${url} &nbsp;·&nbsp; ${date}</p>
  <p class="themes">Themes: ${themes.join(", ")}</p>
  <hr/>
  <h2>Generated FAQs (${faqs.length})</h2>
  ${faqRows}
  <hr/>
  <h2>Content Gaps (${gaps.length})</h2>
  ${gapRows}
</body>
</html>`
}

function exportAsPdf(
  faqs: FaqItem[],
  gaps: ContentGapItem[],
  url: string,
  themes: string[]
) {
  const html = buildPrintHtml(faqs, gaps, url, themes)
  const win = window.open("", "_blank")
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
    win.close()
  }, 400)
}

// ── DOCX ─────────────────────────────────────────────────────────────────────

async function exportAsDocx(
  faqs: FaqItem[],
  gaps: ContentGapItem[],
  url: string,
  themes: string[]
) {
  const { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } =
    await import("docx")

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const sectionBreak = new Paragraph({
    children: [new TextRun({ text: "", break: 1 })],
  })

  const divider = new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" } },
    spacing: { after: 160 },
    children: [],
  })

  // Header
  const headerParagraphs = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: "IntentScout Research Report", bold: true, size: 40 })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "URL: ", bold: true, size: 20, color: "555555" }),
        new TextRun({ text: url, size: 20, color: "555555" }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 20, color: "555555" }),
        new TextRun({ text: date, size: 20, color: "555555" }),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Themes: ", bold: true, size: 20, color: "555555" }),
        new TextRun({ text: themes.join(", "), size: 20, color: "555555" }),
      ],
      spacing: { after: 200 },
    }),
    divider,
  ]

  // FAQ section
  const faqHeading = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({ text: `Generated FAQs (${faqs.length})`, bold: true, size: 28, color: "7C3AED" }),
    ],
    spacing: { after: 160 },
  })

  const faqParagraphs = faqs.flatMap((faq, i) => [
    new Paragraph({
      children: [
        new TextRun({ text: `${i + 1}. `, bold: true, size: 22, color: "7C3AED" }),
        new TextRun({ text: faq.question, bold: true, size: 22 }),
      ],
      spacing: { before: 120, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: stripMarkdown(faq.answer), size: 20, color: "444444" })],
      spacing: { after: 60 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Source: ${faq.sourceQuery}`, size: 18, color: "999999", italics: true }),
      ],
      spacing: { after: 160 },
    }),
  ])

  // Content Gaps section
  const gapHeading = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({ text: `Content Gaps (${gaps.length})`, bold: true, size: 28, color: "7C3AED" }),
    ],
    spacing: { before: 200, after: 160 },
  })

  const gapParagraphs = gaps.flatMap((gap, i) => [
    new Paragraph({
      children: [
        new TextRun({ text: `${i + 1}. `, bold: true, size: 22, color: "7C3AED" }),
        new TextRun({ text: gap.question, bold: true, size: 22 }),
      ],
      spacing: { before: 120, after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Type: `, bold: true, size: 20, color: "7C3AED" }),
        new TextRun({ text: gap.gapType, size: 20, color: "7C3AED" }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: gap.rationale, size: 20, color: "444444" })],
      spacing: { after: 160 },
      alignment: AlignmentType.JUSTIFIED,
    }),
  ])

  const doc = new Document({
    sections: [
      {
        children: [
          ...headerParagraphs,
          sectionBreak,
          faqHeading,
          ...faqParagraphs,
          divider,
          gapHeading,
          ...gapParagraphs,
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const slug = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "-").slice(0, 40)
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `intentscout-${slug}.docx`
  a.click()
  URL.revokeObjectURL(a.href)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExportButton({ faqs, gaps }: ExportButtonProps) {
  const { url, themes } = useThemesStore()
  const [open, setOpen] = useState(false)
  const [loadingDocx, setLoadingDocx] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handlePdf = () => {
    setOpen(false)
    exportAsPdf(faqs, gaps, url, themes)
  }

  const handleDocx = async () => {
    setOpen(false)
    setLoadingDocx(true)
    try {
      await exportAsDocx(faqs, gaps, url, themes)
    } finally {
      setLoadingDocx(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loadingDocx}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-60"
      >
        {loadingDocx ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileText className="w-3.5 h-3.5" />
        )}
        {loadingDocx ? "Exporting…" : "Export"}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-1">
            <button
              type="button"
              onClick={handlePdf}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left"
            >
              <FileText className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-medium">Download PDF</p>
                <p className="text-[10px] text-gray-500">Print-ready report</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDocx}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left"
            >
              <AlignLeft className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="font-medium">Download DOCX</p>
                <p className="text-[10px] text-gray-500">Microsoft Word document</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
