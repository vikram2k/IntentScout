import { HttpError } from "@/common/errors"
import Anthropic from "@anthropic-ai/sdk"
import type {
  ExtractThemesResult,
  GenerateFaqsParams,
  GenerateFaqsResult,
  IAIClient,
} from "./iAIClient"

const SYSTEM_PROMPT = `## Role
You are an expert Technical SEO and Consumer Research Strategist, responsible for enhancing the SEO of a D2C webpage (Product Page or Collection Page).

## Tasks
1. Analyze the page (Product or Collection) and extract relevant information while ignoring branded marketing fluff.
2. Identify whether the page is:
   - A Product Page → Focus on specific product type, primary use case, and main ingredient/material.
   - A Collection/Category Page → Focus on broader category, product types, and user purchase intent.
3. Translate marketing jargon into real human search terms (e.g., "Ultra Hydration Complex" → "dry skin moisturizer").
4. Extract 3–5 core Search Themes (seed keywords):
   - Must be 2–4 words each.
   - Written exactly how consumers search on Google.
   - Broad enough for SERP mining but not single-word generic.
5. Generate sensible keyword combinations based on:
   - Category & sub-category
   - Equivalent human search terms
   - Extracted search themes
   - Realistic search behavior for the given country market.
6. Select the top 5 most relevant keyword combinations.

## Output Rules
- Line 1: Page type — either "PRODUCT" or "COLLECTION" (single word, all caps).
- Lines 2–6: Numbered list of top 5 keyword combinations (1. to 5.).
  - Each must be 2–5 words.
  - Exclude brand names from the keywords.
  - Each keyword should be distinct — avoid overlapping or near-duplicate phrases.
- No markdown formatting.
- No explanations.
- No reasoning.
- No additional text.`

function buildUserPrompt(url: string, country: string, pageText: string): string {
  return `## Inputs
URL: ${url}
Country Market: ${country}
Scraped Content: ${pageText}`
}

function parseResponse(content: string): ExtractThemesResult {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // First line is page type
  const firstLine = lines[0]?.toUpperCase() ?? ""
  const pageType: ExtractThemesResult["pageType"] =
    firstLine === "COLLECTION" ? "COLLECTION" : "PRODUCT"

  // Remaining lines are numbered themes
  const themes = lines
    .slice(1)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 5)

  return { pageType, themes }
}

export class AnthropicClient implements IAIClient {
  private client: Anthropic

  constructor(
    apiKey: string,
    private readonly model: string
  ) {
    this.client = new Anthropic({ apiKey })
  }

  async extractThemes(params: {
    url: string
    country: string
    pageText: string
  }): Promise<ExtractThemesResult> {
    const { url, country, pageText } = params

    const response = await this.client.messages.create({
      model: this.model,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(url, country, pageText) }],
      temperature: 0.3,
      max_tokens: 300,
    })

    const block = response.content[0]
    const content = block?.type === "text" ? block.text : null

    if (!content) {
      throw new HttpError("AI returned empty response", 502)
    }

    const result = parseResponse(content)

    if (result.themes.length === 0) {
      throw new HttpError("AI could not extract themes from this page", 422)
    }

    return result
  }

  async generateFaqs(params: GenerateFaqsParams): Promise<GenerateFaqsResult> {
    const { pageType, brandGuidelines, pageText, themes, allQueries } = params

    const pageTypeLabel =
      pageType === "COLLECTION" ? "Collection/Category Page" : "Product Page"

    const prompt = `You are a world-class SEO content strategist and conversion copywriter. Your task is to analyze real-world search data against a specific landing page and generate a structured JSON report.
PAGE CONTEXT:
Page Type: ${pageTypeLabel}
* BRAND GUIDELINES & VOICE *
Review the <brand_guidelines> section at the bottom of this prompt.
- If guidelines are provided, you MUST strictly adhere to them. This includes matching the exact tone of voice, avoiding any forbidden words, and following specific formatting or compliance rules.
- If the <brand_guidelines> section is empty or says "None", default to a highly professional, helpful, and persuasive e-commerce tone.
PART 1: FAQ GENERATION
Generate highly relevant FAQ entries by matching the "REAL-WORLD SEARCH QUERIES" against the "PAGE CONTENT".
- Volume: Generate up to 15 high-quality FAQs.
- Accuracy: Answer ONLY questions that can be definitively answered using the provided page content.
* CRITICAL SEO FORMATTING RULES *
The format of the "question" and "answer" depends entirely on the Page Type:
- IF PAGE TYPE IS "Collection/Category Page":
  * QUESTION: Base the question on the raw SERP query intent, converting fragments into fully formed, natural-sounding questions (e.g., use the intent of "full frame reading glasses" to write "What are the benefits of full frame reading glasses?"). Keep it broad and high-level. DO NOT insert the Brand Name or specific proprietary product types into the question.
  * ANSWER: Pivot the generic question to position the brand's collection as the ultimate solution. Explicitly use the Brand Name and Collection Name (if available). Do not rely solely on pronouns like "we" or "our".
- IF PAGE TYPE IS "Product Page":
  * QUESTION: Base the question on the raw SERP query intent, converting fragments into fully formed, natural-sounding questions. Use the "Generic Product Type" (e.g., "niacinamide serum", "reading glasses") in the Question. DO NOT use the Brand Name or Proprietary Product Name in the question. If the raw SERP query uses pronouns like "it" (e.g., "does it cause purging?"), replace "it" with the Generic Product Type (e.g., "Does niacinamide serum cause purging?").
  * ANSWER: Pivot to position the specific product as the ultimate solution. Explicitly use the Brand Name and exact Product Name in the text.
- Answer Length & Formatting: Write descriptive, informative answers. The answer length MUST be between 30 and 60 words. Do not write overly brief, single-sentence answers. Use Markdown (bolding, bullets) inside the answer string where helpful to structure the information.
- Format: JSON array of {question, answer, sourceQuery} objects.
PART 2: CONTENT GAP ANALYSIS
Identify critical questions from the search data that the page DOES NOT currently answer.
- Select up to 7 of the most important missing queries.
- Categorize the "gapType": Use exactly one of ["Feature Comparison", "Pricing/Cost", "Trust/Safety", "How-to/Usage", "General Detail"].
- Include a short, strategic rationale advising the website owner on why adding this information will increase conversions.
- Format: JSON array of {question, gapType, rationale} objects.

---
DATA INPUTS & PAGE CONTENT (Your strict source of truth):

<brand_guidelines>
${brandGuidelines}
</brand_guidelines>

<page_text>
${pageText}
</page_text>

CORE THEMES: ${themes.join(", ")}

REAL-WORLD SEARCH QUERIES:
${allQueries}

---
CRITICAL INSTRUCTION: Respond with ONLY raw, valid JSON. Do not wrap the JSON in markdown blocks (e.g., do not use \`\`\`json). Use this exact structure:
{
  "faqs": [
    {"question": "...", "answer": "...", "sourceQuery": "..."}
  ],
  "contentGaps": [
    {"question": "...", "gapType": "...", "rationale": "..."}
  ]
}`

    const response = await this.client.messages.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 4096,
    })

    const block = response.content[0]
    const content = block?.type === "text" ? block.text : null

    if (!content) {
      throw new HttpError("AI returned empty response for FAQ generation", 502)
    }

    try {
      // Strip any markdown code fences if the model still wraps it
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      const parsed = JSON.parse(cleaned)

      return {
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
        contentGaps: Array.isArray(parsed.contentGaps)
          ? parsed.contentGaps
          : [],
      }
    } catch (err) {
      console.error("Failed to parse FAQ JSON:", content)
      throw new HttpError("AI returned invalid JSON for FAQ generation", 502)
    }
  }
}
