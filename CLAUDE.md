# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with React 19, TypeScript, and TailwindCSS. It implements a tax education and calculation chatbot using the `@assistant-ui/react` library. The application provides two modes:
1. **Tax Calculation Mode** - Allows users to input tax profile information and get personalized tax calculations
2. **Learn About Tax Mode** - Educational chatbot for tax-related questions

The frontend communicates with a backend API (`NEXT_PUBLIC_BACKEND_API`) for both chat functionality and tax calculations.

## Development Commands

```bash
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
