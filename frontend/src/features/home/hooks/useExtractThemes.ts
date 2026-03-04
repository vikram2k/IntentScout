import { checkUnauthorized, post, useMutation } from "@/common/api"

interface ExtractThemesPayload {
  url: string
  country: string
}

interface ExtractThemesResponse {
  themes: string[]
  pageType: "PRODUCT" | "COLLECTION"
  url: string
  country: string
}

export const useExtractThemes = () =>
  useMutation<ExtractThemesResponse, ExtractThemesPayload>({
    mutationKey: ["extractThemes"],
    mutationFn: async (payload) => {
      const response = await post<ExtractThemesResponse>("/themes/extract", payload)
      return checkUnauthorized(response)
    },
  })
