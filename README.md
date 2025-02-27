# My Color Palette

A modern web application that analyzes user photos to determine their personal color palette based on seasonal color analysis theory.

## Overview

My Color Palette is a Next.js application that helps users discover their ideal color palette based on their physical characteristics. The app uses AI image analysis to determine a user's seasonal color type, recommended colors, and provides a celebrity style match.

### Key Features

- Photo upload and analysis
- AI-powered seasonal color analysis
- Personalized color recommendations
- Celebrity style matching
- Interactive visual stories presentation
- Mobile-responsive design
- End-to-end type safety

## Technology Stack

- **Frontend**: Next.js (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes with tRPC
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini-2.0-flash-001 LLM integration
- **Package Manager**: pnpm

## Application Flow

1. **User Upload**:
   - Users upload a photo of themselves through the upload-dropzone component
   - The image is processed and sent to the analysis endpoint

2. **Analysis**:
   - The `analyzePalette` mutation in the palette router processes the image
   - Google's Gemini API analyzes the image to determine:
     - Season (Spring, Summer, Autumn, Winter)
     - Subseason (e.g., "Bright Spring", "True Winter")
     - Recommended colors with personalized reasons
     - User's apparent gender

3. **Data Storage**:
   - Analysis results are stored in PostgreSQL via Drizzle ORM
   - Data is organized into palette, colors, and celebrities tables

4. **Results Presentation**:
   - User is redirected to their unique palette page (`/[id]` route)
   - The `PaletteStories` component presents the results as interactive, swipeable "stories"
   - All displayed information comes directly from the database, ensuring accuracy
   - After viewing the stories, users see a summary of their results

## Project Structure

- `/src/app`: Next.js application code and routes
  - `/[id]`: Dynamic route for individual palette results
  - `/components`: Reusable UI components
- `/src/server`: Backend code
  - `/api/routers`: tRPC routers including palette analysis
  - `/db`: Database schema and configuration
- `/src/palette.json`: Knowledge base of seasonal color data

## Key Components

### Upload Component

The upload dropzone handles user photo submission and triggers the analysis process.

### Palette Analysis

The palette router (`/src/server/api/routers/palette.ts`) contains:
- `analyzePalette`: Processes images and generates color analysis
- `getById`: Retrieves stored palette data

### Results Presentation

The `PaletteStories` component in `/src/app/[id]/palette-stories.tsx` presents results in an engaging, story-like format with animations and transitions.

## Design Principles

- **Responsive Design**: All pages are optimized for mobile, tablet, and desktop
- **SEO Optimization**: Pages include proper metadata for search engines
- **Type Safety**: End-to-end type safety using tRPC and TypeScript
- **Visual Appeal**: Rich visual presentation with animations and transitions
- **Accuracy**: All displayed information comes directly from database records

## Development

### Prerequisites

- Node.js
- pnpm
- PostgreSQL database
- Google API key for Gemini

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and API credentials

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

## Production

The application is optimized for production deployment with:
- Server-side rendering for optimal performance
- Image optimization
- API route handling
- Database connection pooling
