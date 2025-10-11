# Chogiare Frontend

A modern React + TypeScript frontend for the Chogiare marketplace platform, built with strict TypeScript, Redux Toolkit, TanStack Query, and shadcn/ui components.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript (strict mode), Vite
- **State Management**: Redux Toolkit with Redux Thunk
- **Data Fetching**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui primitives with Tailwind CSS
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios with concurrency-safe token refresh
- **Mocking**: MSW (Mock Service Worker) for development
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier with strict TypeScript rules
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Performance**: Code splitting, lazy loading, image optimization

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chogiare-fe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🏗️ Project Structure

```
src/
├── api/                 # API client and endpoints
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   ├── auth/           # Authentication components
│   ├── demo/           # Demo data loader
│   ├── home/           # Home page components
│   ├── layout/         # Layout components
│   ├── product/        # Product-related components
│   ├── seller/         # Seller dashboard components
│   └── profile/        # Profile components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── mocks/              # MSW handlers and mock data
├── pages/              # Page components
├── store/              # Redux store and slices
├── test/               # Test files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎨 UI Components

The project uses shadcn/ui primitives for consistent, accessible components:

- **Button** - Various button variants and sizes
- **Card** - Content containers with header, content, footer
- **Input** - Form input fields
- **Badge** - Status indicators and labels
- **Avatar** - User profile images
- **Tabs** - Tabbed content navigation
- **Textarea** - Multi-line text input

## 🔐 Authentication

The app includes a complete authentication system with:

- Login/Register forms with validation
- Password reset functionality
- OAuth integration (Google, Facebook) - mocked
- Protected routes and role-based access
- Token management with automatic refresh

## 📊 State Management

- **Redux Toolkit**: Global state management
- **TanStack Query**: Server state and caching
- **React Hook Form**: Form state management

### Redux Slices

- `authSlice` - Authentication state
- `userSlice` - User profile and settings
- `productSlice` - Product data and filters
- `cartSlice` - Shopping cart state
- `sellerSlice` - Seller dashboard data
- `uiSlice` - UI state (modals, notifications, theme)

## 🌐 API Integration

- **Axios**: HTTP client with interceptors
- **MSW**: Mock Service Worker for development
- **Concurrency-safe token refresh**: Prevents race conditions
- **Error handling**: Centralized error management

## 🧪 Testing

The project uses Vitest and React Testing Library for testing:

- Unit tests for components
- Integration tests for user flows
- Mock API responses with MSW
- Coverage reporting

## 🎯 Demo Data

The app includes a comprehensive demo data loader that supports:

- **CSV upload**: Parse product data from CSV files
- **JSON input**: Direct JSON data input
- **Markdown tables**: Parse markdown table format
- **Preview functionality**: See parsed data before seeding
- **Sample data**: Pre-loaded demo data for testing

## ♿ Accessibility

- Semantic HTML structure
- ARIA attributes and labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 🚀 Performance

- **Code splitting**: Route-based lazy loading
- **Image optimization**: Lazy loading with placeholders
- **Bundle optimization**: Tree shaking and chunk splitting
- **Caching**: React Query caching strategies
- **Preloading**: Critical resource preloading

## 🔧 Configuration

### TypeScript

Strict TypeScript configuration with:
- `noImplicitAny: true`
- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`

### ESLint

Strict linting rules:
- TypeScript-specific rules
- React and React Hooks rules
- Accessibility rules
- Prettier integration

### Tailwind CSS

Custom design system with:
- CSS variables for theming
- Dark mode support
- Responsive design utilities
- Custom component variants

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🌙 Theme Support

- Light/Dark mode toggle
- System preference detection
- Persistent theme storage
- Smooth theme transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using React, TypeScript, and modern web technologies.# chogiare
