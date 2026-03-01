# Chogiare Frontend

A modern React 19 + TypeScript marketplace platform frontend for buying, selling, and managing products with real-time features, admin dashboard, and comprehensive seller tools.

**Tech Stack**: React 19 | TypeScript 5.9 (strict) | Vite | TanStack Query | Zustand | Tailwind CSS | shadcn/ui | MSW | Vitest

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repository-url>
cd chogiare-fe
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:3000`

## Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Check linting
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run typecheck       # TypeScript type checking
npm run test            # Run tests with Vitest
npm run test:ui         # Interactive test UI
npm run test:coverage   # Test coverage report
npm run seed            # Seed database
```

## Documentation

Complete documentation is in the `docs/` folder:

- **[docs/project-overview-pdr.md](docs/project-overview-pdr.md)** - Project vision, requirements, roadmap
- **[docs/codebase-summary.md](docs/codebase-summary.md)** - Codebase structure, modules, tech stack details
- **[docs/code-standards.md](docs/code-standards.md)** - Code patterns, naming, best practices, testing guidelines
- **[docs/system-architecture.md](docs/system-architecture.md)** - Architecture layers, data flow, design patterns

## Project Features

### User Roles

- **Buyers**: Browse, search, purchase, track orders, review products
- **Sellers**: Manage products, inventory, orders, customers, revenue
- **Admins**: Platform oversight, user management, content moderation

### Core Capabilities

#### Authentication & Authorization

- Email/password login with verification
- OAuth integration support
- JWT token refresh (concurrency-safe)
- Role-based access control
- Protected routes per role

#### Product Management

- Browse with pagination/infinite scroll
- Search and advanced filtering
- Product details with reviews and images
- Bulk import (CSV/Excel)
- Stock management

#### Shopping & Orders

- Cart with persistence
- Checkout flow with address management
- Order tracking with status timeline
- Order history and invoices
- Returns and refunds

#### Seller Dashboard

- Product CRUD operations
- Customer management
- Revenue reports with charts
- Order fulfillment
- Notification management

#### Admin Panel

- Platform metrics and analytics
- User management (suspend, verify, ban)
- Content moderation (products, reviews)
- Order dispute resolution
- System settings and reporting

#### Additional Features

- Real-time chat (mocked)
- Notification system
- Wallet/payment integration
- Review and rating system
- Performance optimization

## Architecture

Layered architecture with clear separation:

```
Components (Pages, Features)
  ↓
Custom Hooks (Business Logic)
  ↓
State Management (Zustand, TanStack Query, React Hook Form)
  ↓
API Client (Axios with Interceptors)
  ↓
Backend API
```

**State Management**:

- Zustand for client state (auth, cart, filters)
- TanStack Query for server state (caching, invalidation)
- React Hook Form for form state (validation, submission)

**HTTP Client**:

- Singleton Axios instance
- Concurrency-safe token refresh
- Automatic token injection
- Request/response interceptors
- Error handling with auto-redirect to login

## Code Quality

### TypeScript

- Strict mode: `true`
- `noImplicitAny`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- Full type coverage, no `any` allowed

### Testing

- Vitest + React Testing Library
- MSW for API mocking
- Minimum 80% coverage for critical paths
- Unit, integration, component tests

### Linting & Formatting

- ESLint with TypeScript/React/A11y rules
- Prettier for consistent formatting
- Pre-commit hooks (auto-fix)

## Directory Structure

```
src/
├── api/                 # Endpoints + HTTP client
├── components/          # UI components (pages, features, ui, layout)
├── stores/             # Zustand state stores
├── hooks/              # Custom React hooks (useAuth, useProducts, etc)
├── pages/              # Page components (lazy loaded)
├── types/              # TypeScript definitions
├── lib/                # Utility libraries (schemas, helpers)
├── mocks/              # MSW handlers + mock data
├── contexts/           # React contexts
├── constants/          # App constants, query keys
├── i18n/               # Internationalization
└── test/               # Test setup + configuration
```

## Key Technologies

| Category  | Tech                                           |
| --------- | ---------------------------------------------- |
| Framework | React 19, React Router 7                       |
| Language  | TypeScript 5.9                                 |
| Build     | Vite 7.1                                       |
| State     | Zustand 5, TanStack Query 5, React Hook Form 7 |
| UI        | shadcn/ui, Tailwind CSS 3.4, Lucide Icons      |
| HTTP      | Axios 1.12                                     |
| Forms     | Zod validation                                 |
| Data      | PapaParse, xlsx                                |
| Testing   | Vitest 3.2, React Testing Library 16.3         |
| Quality   | ESLint, Prettier, TypeScript strict mode       |

## Performance Optimizations

- **Code Splitting**: Route-based lazy loading with Suspense
- **Caching**: TanStack Query with configurable staleTime/gcTime
- **Images**: Lazy loading with placeholders
- **Components**: React.memo for expensive components
- **Hooks**: useCallback, useMemo for computation optimization

**Targets**:

- LCP < 2.5s | FID < 100ms | CLS < 0.1
- Main bundle < 200KB gzipped
- Lighthouse score > 90

## Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML structure
- ARIA labels and attributes
- Keyboard navigation throughout
- Screen reader support
- Focus management

## Security

- JWT tokens with automatic refresh
- XSS protection via React escaping
- Input validation with Zod
- CORS/CSP headers
- Protected routes with role checks

## Development Workflow

1. **Feature Branch**: Create from `develop` (feature/_, fix/_, etc)
2. **Code Changes**: Follow [code standards](docs/code-standards.md)
3. **Tests**: Write tests, ensure coverage
4. **Quality**: `npm run lint:fix && npm run format && npm run typecheck`
5. **Pull Request**: Create PR to `develop`
6. **Review**: Code review + CI checks required
7. **Merge**: Merge after approval
8. **Release**: Release from `main` branch

## Configuration

- **API URL**: `VITE_API_URL` environment variable (default: `/api`)
- **Build Output**: `dist/` folder
- **Public Assets**: `public/` folder
- **TypeScript Paths**: `@/` alias for `src/`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Read [code standards](docs/code-standards.md)
2. Create feature branch from `develop`
3. Follow commit message format: `type(scope): description`
4. Run linting, tests, typecheck before committing
5. Submit PR with description
6. Wait for code review and CI checks
7. Merge after approval

## Environment Variables

```bash
VITE_API_URL=http://localhost:3001/api    # Backend API endpoint
```

## Support

- Check documentation in `docs/`
- Review code examples in components
- See test files for usage patterns
- Check GitHub issues for known problems

## License

MIT

---

**Status**: Active Development | **Phase**: Stable Beta | **Last Updated**: December 20, 2025
