import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserRouteGuard } from '../user-route-guard'

// Mock the auth store
vi.mock('@/stores/authStore', () => {
  return {
    useAuthStore: vi.fn(),
  }
})

// Mock react-router
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    Navigate: ({ to, replace: _replace, state: _state }: { to: string; replace?: boolean; state?: unknown }) => {
      return <div data-testid="navigate" data-to={to} />
    },
    useLocation: () => ({ pathname: '/test' }),
  }
})

import { useAuthStore } from '@/stores/authStore'

describe('UserRouteGuard', () => {
  const mockUseAuthStore = useAuthStore as ReturnType<typeof vi.fn>

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state while checking auth', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    })

    const { container } = render(
      <UserRouteGuard>
        <div>Protected Content</div>
      </UserRouteGuard>
    )

    // Check for the loading spinner
    const loadingDiv = container.querySelector('.animate-spin')
    expect(loadingDiv).toBeInTheDocument()
  })

  it('should redirect to login if not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })

    render(
      <UserRouteGuard>
        <div>Protected Content</div>
      </UserRouteGuard>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/auth/login')
  })

  it('should render children if authenticated without role requirement', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', roles: ['buyer'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard>
        <div data-testid="protected">Protected Content</div>
      </UserRouteGuard>
    )

    expect(screen.getByTestId('protected')).toBeInTheDocument()
  })

  it('should render children if user has required seller role', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', roles: ['seller', 'buyer'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard requiredRole="seller">
        <div data-testid="seller-content">Seller Content</div>
      </UserRouteGuard>
    )

    expect(screen.getByTestId('seller-content')).toBeInTheDocument()
  })

  it('should redirect if user does not have required seller role', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', roles: ['buyer'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard requiredRole="seller">
        <div>Seller Content</div>
      </UserRouteGuard>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/')
  })

  it('should redirect to custom redirectTo path if role check fails', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', roles: ['buyer'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard requiredRole="seller" redirectTo="/not-authorized">
        <div>Seller Content</div>
      </UserRouteGuard>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/not-authorized')
  })

  it('should protect seller routes correctly', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', roles: ['seller'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard requiredRole="seller">
        <div data-testid="seller-dashboard">Seller Dashboard</div>
      </UserRouteGuard>
    )

    expect(screen.getByTestId('seller-dashboard')).toBeInTheDocument()
  })

  it('should block non-seller users from seller routes', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '2', roles: ['buyer'] },
      isLoading: false,
    })

    render(
      <UserRouteGuard requiredRole="seller">
        <div>Seller Dashboard</div>
      </UserRouteGuard>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toBeInTheDocument()
  })
})
