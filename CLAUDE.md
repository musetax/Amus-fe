# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based AI chatbot application for tax assistance called "Muse Node Chatbot". It provides tax education, refund calculations, paycheck calculations, and life events updates through a conversational interface built on the `@assistant-ui/react` framework.

## Development Commands

```bash
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
