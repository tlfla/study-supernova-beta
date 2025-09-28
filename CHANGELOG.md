# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-XX

### Added
- **Quiz Modes & Check-to-Reveal**: Implemented Practice and Exam modes with conditional answer reveal. Practice mode requires "Check Answer" before showing correctness and explanation; Exam mode only reveals after quiz completion.
- **Results Summary**: Added comprehensive results page with score header, category breakdown table, streaks tracking (best/current), and action buttons (Review Missed Only, Retry Quiz, Back to Dashboard).
- **Review Missed-Only Flow**: Added toggle to filter questions to missed-only, with expandable explanations and enhanced bookmark functionality.
- **Bookmark-All Active Styling**: Implemented bookmark-all toggle with honey amber active state (`bg-[var(--bookmark-500)] hover:bg-[var(--bookmark-600)]`) and proper aria-pressed attributes.
- **Profile Turquoise Success Toast**: Updated success toast styling to use turquoise color (`bg-[var(--primary-500)] text-white`) for better visual feedback.
- **Token Centralization**: Unified all design tokens using CSS variables through HSL format, eliminating hardcoded hex values and ensuring consistent theming.
- **Glassmorphism Dashboard**: Applied subtle glassmorphism styling (`bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border`) to all Dashboard cards for modern visual appeal.

### Changed
- **Rationale → Explanation Rename**: Updated data schema to use `explanation` instead of `rationale` across types, mock JSON, providers, and UI components with backward compatibility mapping.
- **DataProvider Interface**: Enhanced interface with new methods (`getSessionStats`, `bookmarkAll`, `unbookmarkAll`) and updated parameter signatures for better type safety.
- **UserResponse & Bookmark Types**: Updated to use optional `userId` and improved field naming (`timeSpentSec`, `createdAt`).
- **StudySession Type**: Added `correctCount` and `accuracy` fields for better progress tracking.

### Fixed
- **Backward Compatibility**: Added mapping to handle legacy `rationale` fields, ensuring smooth migration from v0.1.0.
- **Mobile Safe Area**: Enhanced BottomTabBar with proper safe-area insets and content padding to prevent overlap on iOS devices.
- **Type Safety**: Improved TypeScript interfaces and added comprehensive type checking with `tsc --noEmit` script.

### Tests
- **Quiz Flow Tests**: Added tests ensuring Start Quiz routes to options (not directly to quiz) and bookmark-all toggles work correctly.
- **Component Tests**: Enhanced test coverage for Results page bookmark functionality and navigation flows.
- **Type Safety**: Added typecheck script to ensure build-time type validation.

### Technical
- **Build Optimization**: Maintained `vite build` for production builds with separate `typecheck` script for development.
- **Provider Architecture**: Kept MockDataProvider as default with environment-based selection (`VITE_DATA_PROVIDER=mock|supabase`).
- **Design System**: Centralized all tokens in Tailwind config using CSS variables for maintainability.

---

## [0.1.0] - 2024-12-XX

### Added
- Initial release with basic quiz functionality
- Mock data provider with 60+ questions
- Dashboard with progress tracking
- Quiz flow with basic results
- Review and profile pages
- Mobile-first responsive design
- Tailwind CSS with custom design system
