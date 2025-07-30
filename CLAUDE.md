# CLAUDE.md

**IMPORTANT** Claude Code must be answered in Japanese for this project.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- Personal development project for frontend learning purposes
- Individual learning focus - avoid team development or task delegation suggestions
- **Application Type**: Subscription management application (personal payment management)
- **Language**: Japanese UI, Japanese comments used

## Package Manager

This project uses **pnpm** (see pnpm-lock.yaml and pnpm-workspace.yaml). Always use pnpm instead of npm or yarn.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compilation followed by Vite build)
- `pnpm lint` - Run ESLint on all files with automatic fix
- `pnpm format` - Format code using Prettier
- `pnpm preview` - Preview production build locally

## Custom Tool

- `npx @tailwindcss/upgrade` - if the tailwindcss styling does not appear as expected, this command should be executed first.

## Development Environment Notes

- We do not propose to set up a development server because it does not work well in the current environment.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **State Management**: TanStack Query v5 for server state, React Context for auth state
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier with ESLint integration

## Project Structure

- Standard Vite + React setup with TypeScript
- Uses project references (tsconfig.json splits into app and node configs)
- Single-page application structure in src/
- Tailwind CSS integrated at build level via Vite plugin

### Key Architecture Components

- **App.tsx**: Main application component with React Router, AuthProvider, and QueryClientProvider setup
- **pages/**: Page-level components (TopPage, LoginPage, SignupPage, DashboardPage) for routing
- **types.ts**: Core TypeScript definitions for Subscription, SubscriptionFormData, and authentication types (User, AuthState, LoginFormData)
- **types/exchange.ts**: Exchange rate related type definitions (Currency, ExchangeRateResponse)
- **contexts/AuthContext.tsx**: Global authentication state management with React Context
- **services/authService.ts**: Supabase Authentication service with email/password login and email memory
- **services/subscriptionService.ts**: User-specific Supabase database operations (CRUD) with authentication checks
- **lib/supabase.ts**: Supabase client configuration and **lib/queryClient.ts**: TanStack Query client setup
- **hooks/useExchangeRate.ts**: Custom hook for fetching and caching exchange rates from external API
- **hooks/useSubscriptions.ts**: TanStack Query hooks with optimistic updates for subscription operations
- **hooks/useToast.ts**: Toast notification management hook
- **utils/exchangeRateCache.ts**: LocalStorage-based caching system with 24-hour expiration
- **utils/dateCalculations.ts**: Date utility functions for subscription cycle calculations
- **reducers/appReducer.ts**: useReducer pattern implementation (available but not actively used)
- **components/**: Modal-based UI components following BaseModal pattern, plus authentication and feature components

### Directory Guidelines

- Keep component hierarchy shallow
- Avoid creating directories with only 1 file
- Don't split components with low reusability
- Prefer simple, flat directory structure

## Coding Guidelines

- Use 2 spaces for indentation
- Always use semicolons
- Prefer single quotes
- All components must be typed with React.FC<Props>
- Use ES modules (import/export)
- All functions and components should be written in Arrow functions (e.g const foo = () => {}).

### Code Comments

- Short Japanese comments should be added to code that performs important processing. We will try to provide easy-to-understand explanations.

## Configuration Notes

- ESLint uses the new flat config format (eslint.config.js)
- TypeScript configuration is split between tsconfig.app.json and tsconfig.node.json
- Tailwind CSS v4 is configured via Vite plugin rather than traditional config file
- Supabase environment variables required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Exchange rate API key required: VITE_EXCHANGE_RATE_API_KEY (for exchange-rate-api.com)
- No test framework currently configured

## Application Architecture

### Hybrid MPA/SPA Architecture
- **Static Landing Pages**: Public folder (`public/`) contains static HTML files (`index.html`, `about.html`, `contact.html`, etc.)
- **React SPA**: Main application (`/app/` base path) handles authenticated user experience  
- **Vite Configuration**: `base: '/app/'` and `outDir: 'dist/app'` separate static content from SPA routing
- **Development vs Production**: Static files require manual editing and separate server for viewing during development
- **Architecture Separation**: Static marketing pages (public/) + Dynamic application (src/ → /app/)

### Routing & Page Structure
- **React Router DOM v7**: SPA routing configuration within `/app/` path
- **Page Components**: TopPage (SPA landing), LoginPage, SignupPage, DashboardPage (main app)
- **Protected Routes**: ProtectedRoute component ensures authentication for dashboard access
- **Navigation**: URL-based navigation with programmatic routing via useNavigate
- **Static/Dynamic Separation**: Public static pages vs dynamic React application

### Data Layer
- **Supabase PostgreSQL**: Cloud database backend with Row Level Security (RLS) enabled
- **Table**: `subscriptions` with columns for id, user_id, name, price, cycle, currency, category, payment fields
- **Authentication**: Supabase Auth manages user sessions and JWT tokens
- **User Isolation**: RLS policies ensure users can only access their own subscription data
- **Exchange Rate API**: External API (exchange-rate-api.com) for real-time currency conversion
- **LocalStorage Cache**: 24-hour caching system for exchange rates + remembered email addresses
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EXCHANGE_RATE_API_KEY` required

### State Management Architecture
- **Authentication State**: React Context (AuthContext) manages global user state and auth operations
- **Server State**: TanStack Query for subscription data with optimistic updates and automatic caching
- **UI State**: React useState for modals, forms, and component-specific state
- **Reducer Pattern**: `appReducer.ts` available for complex state management scenarios (currently not actively used)
- **Service Layer**: `services/subscriptionService.ts` and `services/authService.ts` abstract Supabase operations
- **Custom Hooks**: `useAuth` for authentication, `useSubscriptions` for data operations, `useExchangeRate` for currency conversion, `useToast` for notifications
- **Async State**: Loading and error states managed by TanStack Query and auth context
- **Cache Management**: Query invalidation, optimistic updates, and automatic background refetching

### Component Architecture
- **Page Components**: TopPage, LoginPage, SignupPage, DashboardPage for main application flow
- **Authentication Components**: LoginForm, SignupForm, WelcomePage for unauthenticated users
- **Layout Components**: Header (with user info and logout), Main, Footer
- **Feature Components**: SubscriptionList, SubscriptionItem, Summary (with collapsible details), CategoryFilter
- **Modal Components**: AddSubscriptionModal, EditSubscriptionModal, DeleteConfirmModal
- **Base Components**: BaseModal, SubscriptionFormFields, DatePicker, Odometer, Toast
- **Context Providers**: AuthProvider wraps entire app, QueryClientProvider for TanStack Query

### Data Flow
- **Authentication Flow**: Login → AuthContext → Protected Routes → User-specific data access
- **CRUD Operations**: UI → TanStack Query hooks → Service layer → Supabase with user validation
- **Optimistic Updates**: Immediate UI feedback with automatic rollback on errors
- **Type Safety**: End-to-end TypeScript interfaces from database to UI components
- **Multi-user Isolation**: RLS policies ensure data separation at database level
- **Exchange Rate Flow**: API → LocalStorage Cache → UI with automatic fallback handling
- **Navigation Flow**: React Router → Page Components → Feature Components → Modals

## Authentication System

### User Authentication
- **Login Method**: Email and password authentication via Supabase Auth
- **Email Memory**: Optional email address persistence in LocalStorage
- **Session Management**: Automatic session handling with auth state change listeners
- **Protected Routes**: Unauthenticated users see WelcomePage, authenticated users access main app
- **User Context**: Global authentication state available via useAuth() hook

### Data Security
- **Row Level Security (RLS)**: Database-level user isolation for all subscription data
- **User-Specific Operations**: All CRUD operations automatically filtered by user_id
- **Authentication Validation**: Service layer validates user authentication before database operations
- **Automatic User Association**: New subscriptions automatically linked to current authenticated user

### Database Schema Requirements
```sql
-- subscriptions table must include user_id column
ALTER TABLE subscriptions ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- RLS must be enabled
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for user data isolation
CREATE POLICY "Users can only access their own subscriptions" 
ON subscriptions FOR ALL USING (auth.uid() = user_id);
```

## Multi-Currency Features

### Supported Currencies
- **JPY (Japanese Yen)**: Base currency, no conversion needed
- **USD (US Dollar)**: Converted to JPY using real-time exchange rates
- **EUR (Euro)**: Converted to JPY using real-time exchange rates

### Exchange Rate System
- **API Integration**: Uses exchange-rate-api.com for real-time rates
- **Caching Strategy**: 24-hour LocalStorage cache to minimize API calls
- **Fallback Values**: USD: ¥150, EUR: ¥140 when API is unavailable
- **Error Handling**: Graceful degradation with cached or fallback rates
- **Manual Refresh**: Cache clear functionality available in Summary component

### Currency Conversion Logic
- All amounts rounded down to whole yen (Math.floor)
- Exchange rates cached with timestamp for efficient retrieval
- Summary component displays currencies in fixed order: JPY → USD → EUR

## UI/UX Design Patterns

### Summary Component Features
- **Collapsible Details**: Main view shows total amounts only, detailed breakdown accessible via toggle button
- **Data State Indicators**: Zero amounts display as `--` instead of `$0` or `¥0` to distinguish from actual zero-cost subscriptions
- **Visual Hierarchy**: Data-present items use bold blue text, no-data items use gray lighter text
- **Responsive Animation**: CSS transitions with `max-h-[800px]` to accommodate multi-currency displays
- **State Persistence**: Detail panel state maintained during session (no LocalStorage persistence)

## Commit Guidelines

When you are asked to "commit your changes," create the appropriate commit message yourself according to the following rules

- Commit messages are limited to 50 characters
- The commit message should be in English, short and concise (e.g. fix styling pc-view header)

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Security Reminders

If there is even the slightest chance that the service's API key or special URLs may be written to a json file or env file that may contain the service's API key or special URLs, warn before committing, and suggest that they be added to the .gitignore file.

# Important Instruction Reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.