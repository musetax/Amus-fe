# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

<<<<<<< HEAD
This is a Next.js 15 application built with React 19, TypeScript, and TailwindCSS. It implements a tax education and calculation chatbot using the `@assistant-ui/react` library. The application provides two modes:
1. **Tax Calculation Mode** - Allows users to input tax profile information and get personalized tax calculations
2. **Learn About Tax Mode** - Educational chatbot for tax-related questions

The frontend communicates with a backend API (`NEXT_PUBLIC_BACKEND_API`) for both chat functionality and tax calculations.
=======
This is a Next.js-based AI chatbot application for tax assistance called "Muse Node Chatbot". It provides tax education, refund calculations, paycheck calculations, and life events updates through a conversational interface built on the `@assistant-ui/react` framework.
>>>>>>> cec66f32f1299790f1512092e579861cde6648df

## Development Commands

```bash
<<<<<<< HEAD
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linting
npm run lint
```

## Environment Variables

Required environment variable in `.env.local`:
- `NEXT_PUBLIC_BACKEND_API` - Backend API base URL for tax calculations and chat queries

## Architecture

### Core Application Structure

- **[app/page.tsx](app/page.tsx)** - Main entry point with email validation modal
- **[app/assistant.tsx](app/assistant.tsx)** - Manages dual runtime providers for tax/learn modes
- **[app/layout.tsx](app/layout.tsx)** - Root layout component

### Chat Model Adapters

The application uses custom `ChatModelAdapter` implementations to integrate with the backend:

- **[app/myRuntimeProvider.tsx](app/myRuntimeProvider.tsx)** (`MyModelAdapter`) - Handles "Learn About Tax" mode
  - Streams responses from `/api/tax_education/query`
  - Maintains last 5 messages as conversation history
  - Uses streaming JSON responses with newline-delimited format

- **[app/taxModelAdapter.tsx](app/taxModelAdapter.tsx)** (`TaxModelAdapter`) - Handles "Tax Calculation" mode
  - Posts to `/api/chat/message` with tax calculation requests
  - Non-streaming responses
  - Returns suggestions in metadata

Both adapters use:
- `getCachedEmail()` - Retrieves user email from localStorage
- `getCachedSessionId()` - Manages chat session ID persistence

### UI Components

**Main Thread Component**: [components/chatbot/assistant-ui/thread.tsx](components/chatbot/assistant-ui/thread.tsx)
- Tab switcher between "Tax Calculation" and "Learn About Tax"
- Renders tax data modal for initial profile setup
- Uses `@assistant-ui/react` primitives (ThreadPrimitive, ComposerPrimitive, MessagePrimitive)

**Tax Data Modal**: [components/chatbot/assistant-ui/tax-data.tsx](components/chatbot/assistant-ui/tax-data.tsx)
- Collects user tax profile: name, age, filing status, salary, withholding info
- Transforms form data to backend-compatible format
- Posts to `/api/tax-profile/checkboost` endpoint

### Services & Utilities

**Session Management**: [services/chatSession.ts](services/chatSession.ts)
- `getCachedEmail()` - Retrieves email from localStorage
- `getCachedSessionId()` - Creates or retrieves session ID from localStorage

**Axios Instance**: [utilities/axios.ts](utilities/axios.ts)
- Configured with `NEXT_PUBLIC_BACKEND_API` base URL
- Request interceptor adds Bearer token from localStorage (`authTokenMuse`)
- Response interceptor handles 401s with automatic token refresh
- Redirects to `/login` on auth failure

### Path Aliases

TypeScript path aliases configured in [tsconfig.json](tsconfig.json):
- `@/*` - Maps to project root
- `@public/*` - Maps to public directory

## Styling

- **TailwindCSS** with custom configuration in [tailwind.config.js](tailwind.config.js)
- **HeroUI** component library (`@heroui/react`)
- Custom gradient backgrounds and color palette for tax/financial theme
- Primary font: DM Sans

### Custom Tailwind Extensions
- Gradient backgrounds: `authGradientBg`, `mediumBlueGradient`, `blueGradient`, etc.
- Custom colors: `primaryColor`, `slateColor`, `blueColor`, `purpuleColor`, etc.
- Dark mode support with `class` strategy

## Assistant-UI Integration

This project uses `@assistant-ui/react` for the chat interface:
- Dual runtime providers managed in [app/assistant.tsx](app/assistant.tsx)
- Custom attachment adapters in [app/attachmentAdapter.tsx](app/attachmentAdapter.tsx)
- Markdown rendering with `@assistant-ui/react-markdown`
- Speech recognition support

## Key Behaviors

1. **Email Requirement**: Users must provide email via URL param (`?email=`) or modal on first visit
2. **Session Persistence**: Chat sessions tracked via `chat_session_id` in localStorage
3. **Tab Switching**: Switching between tax/learn modes reinitializes the runtime provider
4. **Tax Profile**: Tax calculation mode requires initial profile data via modal popup

## API Integration Patterns

### Streaming Response (Learn Mode)
```typescript
// Newline-delimited JSON chunks
const lines = chunkStr.split("\n").filter((line) => line.trim() !== "");
for (const line of lines) {
  const json = JSON.parse(line);
  text += json.response;
}
```

### Non-Streaming Response (Tax Mode)
```typescript
const response = await axios.post(endpoint, data);
yield { content: [{ type: "text", text: response.data.response }] };
```

## Important Notes

- The application expects backend endpoints at `NEXT_PUBLIC_BACKEND_API`
- All chat requests include email and session_id
- Token-based authentication with auto-refresh on 401
- Uses Turbopack for faster development builds
=======
# Development
npm run dev          # Start development server with Turbo (localhost:3000)

# Build & Deploy
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Environment Setup

Required environment variables in `.env`:
- `NEXT_PUBLIC_BACKEND_API` - Backend API URL for chat and user data
- `NEXT_PUBLIC_FINANCIAL_API` - Financial suite URL

The app expects URL parameters on load:
- `session_id` - Chat session identifier
- `user_id` - User identifier
- `access_token` - Authentication token
- `client_id` - OAuth client ID
- `client_secret` - OAuth client secret
- `user_image` (optional) - User profile image URL
- `company_logo` (optional) - Company branding logo URL

## Architecture

### Core Flow

The application follows a stateful wizard-like flow:

1. **Home Screen** ([home-screen.tsx](components/chatbot/assistant-ui/home-screen.tsx)) - User selects an agent intent:
   - `tax_education` - Direct to chat for tax questions
   - `tax_refund_calculation` - Collect tax data, then chat
   - `tax_paycheck_calculation` - Collect tax data, then chat
   - `life_events_update` - Update life event information

2. **Form Collection** (if needed):
   - Tax forms: [payrollQuestionchat.tsx](app/payrollQuestionchat.tsx) - Multi-step questionnaire
   - Life events: [life-events-form.tsx](components/chatbot/assistant-ui/life-events-form.tsx)

3. **Chat Interface** ([thread.tsx](components/chatbot/assistant-ui/thread.tsx)) - Main conversation UI

### State Management

The main state orchestration happens in [assistant.tsx](app/assistant.tsx):
- `agentIntent` - Determines which flow to activate
- `showHomeScreen` - Controls home screen visibility
- `showTaxChatbot` - Controls tax form visibility
- `showLifeEventsScreen` / `showLifeEventsForm` - Controls life events flow
- `payrollData` - Pre-filled user tax information

Navigation between screens is controlled via callback props (`onSelectIntent`, `onReturnToHome`, etc.)

### Authentication & API

Authentication is handled via token-based auth in [utilities/auth.ts](utilities/auth.ts):
- Access tokens stored in `localStorage` as `authTokenMuse`
- Automatic token refresh using `client_id` and `client_secret`
- `axiosInstanceAuth` - Pre-configured axios instance with auth interceptors
- All API requests automatically retry once with refreshed token on 401

### Chat System

The chat implementation uses `@assistant-ui/react`:
- **Runtime Provider**: [myRuntimeProvider.tsx](app/myRuntimeProvider.tsx) - Streaming chat adapter that calls backend `/chat` endpoint with `intent` parameter
- **History Adapter**: [services/chatbot.tsx](services/chatbot.tsx) - Loads previous conversations from `/get-user-chats`
- **Messages**: Streamed from backend as Server-Sent Events (SSE) with format `data: {response, urls}`
- **Metadata**: Messages can include `urls` for citation display

### Form System

Multi-step tax form in [app/payrollQuestion/](app/payrollQuestion/):
- `questionFlow.ts` - Determines which questions to ask based on missing data
- `messageGenerator.ts` - Generates chat-like messages for each step
- `inputHandlers.ts` - Validation and handlers for each field type
- `types.ts` - TypeScript definitions for form data

## Key Patterns

### Component Communication
Heavily relies on callback props for inter-component communication. When modifying flows, ensure callbacks are threaded through the component tree properly.

### Conditional Rendering
The main UI switches between screens using conditional rendering in [thread.tsx](components/chatbot/assistant-ui/thread.tsx):
```tsx
{globalError ? <ErrorBanner /> :
 showHomeScreen ? <HomeScreen /> :
 showLifeEventsScreen ? <LifeEventsScreen /> :
 showLifeEventsForm ? <LifeEventsForm /> :
 shouldShowTaxChatbot ? <TaxChatbot /> :
 <ChatInterface />}
```

### Prefilled Data
Forms are pre-populated from `payrollData` fetched via `getPayrollDetails(userId)` in [taxModelAdapter.tsx](app/taxModelAdapter.tsx). The question flow skips fields that already have values.

## Styling

- **Tailwind CSS** with custom configuration in [tailwind.config.js](tailwind.config.js)
- **Custom gradients** defined for brand consistency (e.g., `ChatBtnGradient`, `authGradientBg`)
- **HeroUI** components library integrated
- Custom CSS classes prefixed with `myUniquechatbot` to avoid conflicts when embedded

## File Organization

```
app/
  ├── assistant.tsx              # Main orchestrator component
  ├── myRuntimeProvider.tsx      # Chat streaming adapter
  ├── payrollQuestionchat.tsx    # Tax form chatbot
  ├── payrollQuestion/           # Tax form utilities
  ├── taxModelAdapter.tsx        # API calls for tax data
  └── api/                       # API routes (health, chat proxy)

components/
  └── chatbot/
      ├── assistant-ui/          # Main UI components
      │   ├── thread.tsx         # Chat thread & composer
      │   ├── home-screen.tsx    # Intent selection
      │   ├── life-events-*.tsx  # Life events flow
      │   └── markdown-text.tsx  # Markdown renderer
      └── ui/                    # Reusable UI primitives

services/
  └── chatbot.tsx                # History adapter

utilities/
  └── auth.ts                    # Auth & axios setup
```

## Testing Locally

1. Create `.env` file with required variables
2. Start dev server: `npm run dev`
3. Navigate to `http://localhost:3000?session_id=test&user_id=test_user&access_token=token&client_id=id&client_secret=secret`
4. The app will attempt to load user data and show appropriate screen

## Important Notes

- The application is designed to be embedded as an iframe in a parent application
- Session management relies on URL parameters, not cookies
- All API calls go through the backend proxy to avoid CORS
- TypeScript strict mode is enabled; ensure type safety when making changes
- The chatbot supports streaming responses with visual feedback
>>>>>>> cec66f32f1299790f1512092e579861cde6648df
