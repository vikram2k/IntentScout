import { Navigate, Route, Routes } from "react-router"
import HomePage from "./features/home/pages/HomePage"
import ResultsPage from "./features/results/pages/ResultsPage"
import ThemeReviewPage from "./features/themes/pages/ThemeReviewPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/review" element={<ThemeReviewPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
