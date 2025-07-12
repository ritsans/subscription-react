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

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Database**: Supabase (PostgreSQL)
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier with ESLint integration

## Project Structure

- Standard Vite + React setup with TypeScript
- Uses project references (tsconfig.json splits into app and node configs)
- Single-page application structure in src/
- Tailwind CSS integrated at build level via Vite plugin

### Key Architecture Components

- **App.tsx**: Main application component with subscription state management and modal controls
- **types.ts**: Core TypeScript definitions for Subscription and SubscriptionFormData
- **types/exchange.ts**: Exchange rate related type definitions (Currency, ExchangeRateResponse)
- **services/subscriptionService.ts**: Supabase database operations (CRUD) for subscriptions
- **lib/supabase.ts**: Supabase client configuration
- **hooks/useExchangeRate.ts**: Custom hook for fetching and caching exchange rates from external API
- **utils/exchangeRateCache.ts**: LocalStorage-based caching system with 24-hour expiration
- **components/**: Modal-based UI components following BaseModal pattern

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

### Data Layer
- **Supabase PostgreSQL**: Cloud database backend
- **Table**: `subscriptions` with columns for id, name, price, cycle, currency, category
- **Exchange Rate API**: External API (exchange-rate-api.com) for real-time currency conversion
- **LocalStorage Cache**: 24-hour caching system for exchange rates to minimize API calls
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EXCHANGE_RATE_API_KEY` required

### State Management
- **React useState**: Centralized state management in App.tsx
- **Service Layer**: `services/subscriptionService.ts` abstracts Supabase operations
- **Custom Hooks**: `useExchangeRate` manages exchange rate fetching, caching, and error handling
- **Async State**: Loading and error states managed throughout application
- **Cache Management**: Automatic fallback to cached values with manual refresh capability

### Component Architecture
- **Layout Components**: Header, Main, Footer
- **Feature Components**: SubscriptionList, SubscriptionItem, Summary
- **Modal Components**: AddSubscriptionModal, EditSubscriptionModal, DeleteConfirmModal
- **Base Components**: BaseModal, SubscriptionFormFields

### Data Flow
- CRUD operations handled via service layer
- Type-safe operations with TypeScript interfaces
- Modal-based UI interactions for data manipulation
- Exchange rate data flows: API → Cache → UI with automatic fallback handling
- Currency display order fixed as JPY → USD → EUR in Summary component

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

## Commit Guidelines

When you are asked to "commit your changes," create the appropriate commit message yourself according to the following rules

- Commit messages are limited to 50 characters
- The commit message should be in English, short and concise (e.g. fix styling pc-view header)

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
