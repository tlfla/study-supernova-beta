# Surgical Tech Study App

A mobile-first web application for surgical technology certification exam preparation, built with React, TypeScript, and Vite.

## Features

- 📱 Mobile-first responsive design
- 🎯 Interactive quiz system with multiple choice questions
- 📊 Progress tracking and analytics
- 🔖 Bookmarking system for important questions
- 📚 Category-based question filtering
- ⚡ Instant feedback and rationales
- 🎨 Custom design system with surgical-themed colors
- 🔧 Pluggable data providers (Mock, Supabase, D1)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer
- **Routing**: React Router DOM
- **Data Layer**: Provider pattern with mock data
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd surgical-tech-study-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Card, etc.)
│   └── ...
├── data/               # Data layer
│   ├── providers/      # Data provider implementations
│   └── mock/          # Mock data and generators
├── pages/             # Route components
├── state/             # Global state management
├── styles/            # Global styles and Tailwind config
└── test/              # Test utilities and setup
```

## Data Providers

The app supports multiple data providers that can be configured via environment variables:

### Mock Data (Default)
- **VITE_DATA_PROVIDER**: `mock`
- No external dependencies
- Includes 60+ sample questions across all categories

### Supabase
- **VITE_DATA_PROVIDER**: `supabase`
- Requires: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- PostgreSQL database with row-level security

### D1 (Cloudflare)
- **VITE_DATA_PROVIDER**: `d1`
- Requires D1 binding configuration in `wrangler.toml`
- Edge database for Cloudflare Workers

## Development

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm test       # Run tests
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

### Design System

The app uses a custom color palette optimized for healthcare education:

- **Primary**: Surgical Aqua (`#0D8E83` to `#6ED7CC`)
- **Secondary**: Periwinkle (`#7B9EFF`)
- **Status Colors**: Success, Warning, Danger, Info
- **Interactive**: High contrast ratios for accessibility

## Quiz Flow

1. **Dashboard**: View progress, daily goals, and quick actions
2. **Quiz Options**: Configure category, difficulty, and settings
3. **Quiz**: Take timed or untimed practice quizzes
4. **Results**: Review performance with detailed feedback
5. **Review**: Study bookmarked and missed questions

## Testing

Run the test suite:
```bash
pnpm test
```

The app includes:
- Unit tests for data providers
- Component integration tests
- Smoke tests for main functionality

## Deployment

### Mock Data (Development)
Deploy directly - no external dependencies required.

### Supabase (Production)
1. Create a Supabase project
2. Set up database schema (see provider documentation)
3. Configure environment variables
4. Deploy with your preferred platform

### D1 (Edge)
1. Set up Cloudflare Workers environment
2. Configure D1 database binding
3. Deploy as Cloudflare Worker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Future Enhancements

- [ ] Flashcard spaced repetition system
- [ ] Study schedule and reminders
- [ ] Peer comparison features
- [ ] Offline mode with sync
- [ ] Audio question support
- [ ] Advanced analytics dashboard
