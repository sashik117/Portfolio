import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/lib/LanguageContext'
import { SiteSettingsProvider } from '@/lib/SiteSettingsContext'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <SiteSettingsProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Router>
            <Toaster />
          </QueryClientProvider>
        </SiteSettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App