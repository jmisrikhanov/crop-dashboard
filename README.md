# Crop Dashboard - Agriculture Data Management System

A modern, production-ready web application for managing and visualizing 1,000,000+ crop science research records with advanced filtering, sorting, and pagination capabilities.

## 🚀 Features

### Core Functionality
- **Authentication System** - Secure login/logout with JWT token management
- **Data Table** - High-performance table with server-side pagination handling 1M+ records
- **Advanced Filtering** - Filter by crop name, country, and status
- **Multi-column Sorting** - Sort by any column in ascending/descending order
- **Debounced Search** - Real-time search across multiple fields (500ms debounce)
- **Form Submission** - Complex form with comprehensive validation
- **Responsive Design** - Mobile-first design with sticky columns and horizontal scroll

### Bonus Features ✨
- **Sign Up Page** - User registration with server-side validation
- **Record Detail View** - Click any row to see comprehensive crop details
- **Automatic Token Refresh** - Silent token renewal on 401 errors
- **URL State Synchronization** - Shareable filtered/sorted table states
- **Dark Mode** - Persistent theme switching with "pitch black" aesthetic
- **Unit Tests** - 40 comprehensive tests with 100% pass rate

## 🛠️ Tech Stack

- **Framework**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7.2
- **UI Library**: Ant Design 6.1
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios 1.13
- **Routing**: React Router 7.11
- **Testing**: Vitest 4.0 + React Testing Library 16.3

## 📋 Prerequisites

- **Node.js** 18+ or 20+
- **pnpm** 8+ (recommended) or npm 9+

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jmisrikhanov/crop-dashboard.git
   cd crop-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   The application connects to a pre-deployed backend:
   ```
   API Base URL: https://backendcase.infodecs.dev
   ```
   
   No environment configuration needed - API URL is hardcoded in `src/services/apiClient.ts`

## 🚦 Running the Application

### Development Mode

```bash
pnpm dev
```

The application will start at `http://localhost:5173`

### Production Build

```bash
pnpm build
```

Build output will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## 🧪 Running Tests

### Run All Tests

```bash
pnpm test
```

### Run Tests Once (No Watch Mode)

```bash
pnpm test --run
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

## 🔐 Test Credentials

Use these credentials to log in:

```
Username: testuser
Password: Test1234!
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── ComplexForm.tsx # Multi-field form with validation
│   ├── CropTable.tsx   # Main data table
│   ├── CropSearch.tsx  # Search input with debounce
│   ├── CropDetailDrawer.tsx # Record detail view
│   ├── LoginPage.tsx   # Authentication page
│   ├── SignUpPage.tsx  # Registration page
│   ├── MainLayout.tsx  # App header and layout
│   └── DashboardContent.tsx # Main content area
│
├── hooks/              # Custom React hooks
│   ├── __tests__/     # Hook tests
│   ├── useAuth.ts     # Authentication state management
│   ├── useCrops.ts    # Data fetching and table state
│   └── useDebounce.ts # Debounce utility hook
│
├── services/          # API services
│   ├── __tests__/    # Service tests
│   ├── apiClient.ts  # Axios instance with interceptors
│   ├── authService.ts # Authentication API calls
│   ├── cropService.ts # Crop data API calls
│   └── formService.ts # Form submission API calls
│
├── context/          # React context providers
│   └── ThemeContext.tsx # Dark mode state
│
├── types/           # TypeScript type definitions
│   └── index.ts    # All application types
│
├── test/           # Test configuration
│   └── setup.ts   # Global test setup and mocks
│
├── constants.ts    # Application constants
├── App.tsx        # Root component with routing
└── main.tsx       # Application entry point
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with interactive UI |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Run ESLint |

## 🧪 Test Coverage

**Total: 40 tests across 9 test suites**

- ✅ Authentication (useAuth) - 4 tests
- ✅ Token Management (apiClient) - 2 tests
- ✅ Protected Routes - 3 tests
- ✅ Form Validation - 17 tests
- ✅ Form Submission - 5 tests
- ✅ Data Fetching (useCrops) - 3 tests
- ✅ Crop Service - 3 tests
- ✅ Debouncing (useDebounce) - 2 tests
- ✅ Login Integration - 1 test

## 🎯 Key Features Implementation

### Authentication
- JWT token storage in localStorage
- Automatic token injection in all API requests
- Silent token refresh on 401 errors
- Secure logout with token cleanup

### Performance
- Server-side pagination (handles 1M+ records)
- Debounced search (500ms delay)
- Optimized re-rendering with useCallback
- Lazy loading of crop details

### Data Table
- 8 columns with full sorting support
- Multi-filter capability (crop, country, status)
- Page size selector (10, 25, 50, 100)
- URL state persistence
- Mobile-responsive with sticky ID column

### Security
- Protected routes with authentication guards
- Client-side input validation
- Secure token storage
- Sanitized error messages

## 🌙 Dark Mode

Toggle dark mode using the moon/sun icon in the header. Theme preference is persisted in localStorage.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-optimized header (condensed user info, icon-only buttons)
- Horizontal scroll for table on small screens
- Sticky ID column for better navigation
- Responsive padding and spacing

## 🔗 API Documentation

- **Swagger UI**: https://backendcase.infodecs.dev/api/docs/
- **ReDoc**: https://backendcase.infodecs.dev/api/redoc/

## 🐛 Troubleshooting

### Development server not starting
- Ensure port 5173 is available
- Try `pnpm install` again
- Clear node_modules and reinstall

### Tests failing
- Run `pnpm install` to ensure all test dependencies are installed
- Check that you're using Node.js 18+

### Build errors
- Ensure TypeScript compilation succeeds: `pnpm build`
- Check for any ESLint errors: `pnpm lint`

---

**Built using React + TypeScript + Vite**
