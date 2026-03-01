import { describe, it, expect, vi } from 'vitest'

// Mock all the complex parts of the app to test just the basic structure
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Routes: ({ children }: { children: React.ReactNode }) => children,
    Route: ({ element }: { element: React.ReactNode }) => element,
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@tanstack/react-query', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  }
})

describe('App Module', () => {
  it('App module can be imported', async () => {
    const { default: App } = await import('../App')
    expect(App).toBeDefined()
    expect(typeof App).toBe('function')
  })
})
