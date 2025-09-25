# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reusable Assistant UI component package (`@muse-prod/muse-node-chatbot`) built with Next.js, React, and TypeScript. It's based on the assistant-ui library and provides a customizable chatbot widget with features like PDF generation, email functionality, and speech synthesis.

## Key Commands

### Development
- `npm run dev` - Start development server with Turbo (opens on http://localhost:3000)
- `npm run build` - Build the package for distribution using tsup (outputs to dist/)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Environment Setup
Requires `.env.local` file with:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Architecture Overview

### Core Structure
- **Entry Point**: `src/index.tsx` - Exports the main Assistant component and styles
- **Main Component**: `app/assistant.tsx` - Primary chatbot component with runtime management
- **Build Output**: Package builds to `dist/` directory with both ESM and CJS formats

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

### Package Distribution
- Built as both ESM and CommonJS modules
- Includes TypeScript declarations
- Bundles CSS styles for distribution
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
- `npm run build` - Verify package builds successfully

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
- Session-based chat management
- Requires proper authentication and session handling