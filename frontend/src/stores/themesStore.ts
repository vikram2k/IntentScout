import type { SerpResearchResponse } from "@/features/results/types"
import { create } from "zustand"

export type PageType = "PRODUCT" | "COLLECTION"

interface ThemesStore {
  url: string
  country: string
  themes: string[]
  pageType: PageType | null
  brandFile: File | null
  results: SerpResearchResponse | null

  setExtractResult: (url: string, country: string, themes: string[], pageType: PageType) => void
  addTheme: (theme: string) => void
  removeTheme: (index: number) => void
  setBrandFile: (file: File | null) => void
  setResults: (results: SerpResearchResponse) => void
  reset: () => void
}

export const useThemesStore = create<ThemesStore>((set) => ({
  url: "",
  country: "US",
  themes: [],
  pageType: null,
  brandFile: null,
  results: null,

  setExtractResult: (url, country, themes, pageType) => set({ url, country, themes, pageType }),

  addTheme: (theme) =>
    set((state) => ({
      themes: [...state.themes, theme],
    })),

  removeTheme: (index) =>
    set((state) => ({
      themes: state.themes.filter((_, i) => i !== index),
    })),

  setBrandFile: (file) => set({ brandFile: file }),

  setResults: (results) => set({ results }),

  reset: () =>
    set({
      url: "",
      country: "US",
      themes: [],
      pageType: null,
      brandFile: null,
      results: null,
    }),
}))

// Expose store in dev for preview tooling
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__themesStore = useThemesStore
}
