import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/lib/LanguageContext'
import Portfolio from './pages/Portfolio'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>
              <Route path="/" element={<Portfolio />} />
            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App