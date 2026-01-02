import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@shared/components/ui/sonner'
import { NotificationProvider } from '@shared/components/notification-provider'
import { PerformanceOptimizer } from '@shared/components/seo/PerformanceOptimizer'
import { AdminApp } from '@admin/admin-app'
import { UserApp } from '@user/user-app'

/**
 * Main Application Component
 * Top-level routing split between admin and user contexts
 * Features:
 * - Complete separation of admin (/admin/*) and user (/*) routes
 * - Separate authentication providers for each context
 * - No shared auth logic or conditional rendering
 * - Clean architectural boundaries
 */

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <PerformanceOptimizer>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Admin routes - completely separate context */}
                <Route path="/admin/*" element={<AdminApp />} />

                {/* User routes - everything else */}
                <Route path="/*" element={<UserApp />} />
              </Routes>
              <Toaster />
            </div>
          </PerformanceOptimizer>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App