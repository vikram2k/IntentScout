import { useMutation } from "@/common/api"
import type { SerpResearchResponse } from "../types"

interface RunSerpPayload {
  themes: string[]
  url: string
  country: string
  pageType: "PRODUCT" | "COLLECTION"
  brandFile: File | null
}

export const useRunSerpResearch = () =>
  useMutation<SerpResearchResponse, RunSerpPayload>({
    mutationKey: ["runSerpResearch"],
    mutationFn: async (payload) => {
      const formData = new FormData()
      formData.append("themes", JSON.stringify(payload.themes))
      formData.append("url", payload.url)
      formData.append("country", payload.country)
      formData.append("pageType", payload.pageType)

      if (payload.brandFile) {
        formData.append("brandFile", payload.brandFile)
      }

      // Use native fetch for multipart — lets the browser set Content-Type with boundary automatically
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/serp/research`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Request failed" }))
        throw new Error(err?.data?.message ?? err?.message ?? "SERP research failed")
      }

      const json = await res.json()
      // Unwrap { success: true, data: T } envelope
      return json?.data ?? json
    },
  })
