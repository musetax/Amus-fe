# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reusable Assistant UI component package (`@muse-prod/muse-node-chatbot`) built with Next.js, React, and TypeScript. It's based on the assistant-ui library and provides a customizable chatbot widget with features like PDF generation, email functionality, and speech synthesis.

## Key Commands

### Development
- `npm run dev` - Start development server with Turbo (opens on http://localhost:3000)
- `npm run build` - Build Next.js application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Package Distribution
- `npx tsup` - Build package for distribution using tsup configuration (outputs to dist/)

### Environment Setup
Requires `.env.local` file with:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Architecture Overview

### Core Structure
- **Package Entry Point**: `src/index.tsx` - Exports the main Assistant component and styles
- **Main Component**: `app/assistant.tsx` - Primary chatbot component with runtime management
- **Development**: Next.js application for development and testing
- **Package Build Output**: tsup builds to `dist/` directory with both ESM and CJS formats

### Key Directories
- `app/` - Main application components and runtime providers
- `src/` - Package entry point and bundled styles
- `components/` - Reusable UI components organized by feature
  - `chatbot/` - Core chatbot components
  - `assistant-ui/` - Assistant UI framework integration
  - `ui/` - Shared UI components
- `services/` - Business logic and API integrations
- `utilities/` - Helper functions and authentication
- `lib/` - Shared utilities (utils.ts)

### Technology Stack
- **Framework**: Next.js 15.4+ with React 18/19
- **Build Tool**: tsup for package building
- **Styling**: Tailwind CSS with custom configurations
- **Assistant Framework**: @assistant-ui/react ecosystem
- **AI Integration**: @ai-sdk/openai for AI functionality
- **Additional Features**: 
  - PDF generation (@react-pdf/renderer)
  - Speech synthesis (WebSpeechSynthesisAdapter)
  - File attachments (CustomAttachmentAdapter)
  - Form handling (Formik + Yup)
  - State management (Zustand)

### Dual Build System
- **Development**: Next.js application (`npm run build`) for local development and testing
- **Package Distribution**: tsup configuration builds library to `dist/` for npm publishing
  - Entry: `src/index.tsx`
  - Outputs: ESM and CommonJS modules with TypeScript declarations
  - Bundles CSS styles from `src/styles.css`
  - Externals: React, Next.js, and major UI libraries (not bundled)
- Configured as peer dependency package requiring Next.js and React

### Key Integrations
- OpenAI API integration through @ai-sdk/openai
- ElevenLabs for voice synthesis
- Material-UI and Radix UI for components
- Custom attachment handling for file uploads
- Email and PDF export capabilities

## Development Notes

- Package uses TypeScript with strict mode enabled
- ESLint configuration with Next.js rules
- Tailwind CSS for styling with custom configurations
- Hot reloading enabled in development mode
- Build process generates both declaration files and bundled output

## Testing and Quality

After making code changes, run:
- `npm run lint` - Check code quality and style
- `npm run build` - Verify Next.js application builds successfully
- `npx tsup` - Verify package distribution builds successfully

## Package Build Process

The package uses tsup for building:
- Entry point: `src/index.tsx`
- Output: `dist/` directory with both ESM and CJS formats
- Includes TypeScript declaration files
- Bundles CSS styles from `src/styles.css`
- External dependencies (React, Next.js, etc.) are not bundled

## API Integration

The chatbot integrates with external APIs:
- User chat history via `/v1/api/export/get-user-chats`  
- Tax profile services via `/api/tax-profile/checkboost/`
- Health check endpoint at `/api/health` (returns service status)
- Session-based chat management
- Requires proper authentication and session handling