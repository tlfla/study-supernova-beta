# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-01-XX

### Added
- **Quiz Modes with Check-to-Reveal**: Implemented Practice and Exam modes with conditional answer reveal. Practice mode requires "Check Answer" before showing correctness and explanation; Exam mode only reveals in Summary.
- **Save & Exit with Resume**: Added confirmation modal for leaving active quizzes, localStorage-based persistence, and Resume functionality that restores quiz state exactly where left off.
- **Study Area Page**: New dedicated Study page accessible from bottom navigation with Deep Dives, Key Concepts, and Reference Sheets sections with placeholder content.
- **Collapsible Explanations**: Made explanations collapsible in Results and Review pages (default closed) for better information hierarchy.
- **Enhanced Review Filters**: Added Missed Only toggle, improved filtering logic, and expandable explanations with chevron indicators.
- **Modal Component**: Created reusable Modal component with backdrop blur and proper focus management for confirmations.

### Changed
- **Quiz Flow Logic**: Complete rewrite of quiz behavior - Practice mode requires explicit "Check Answer" before reveal, Exam mode never reveals during quiz.
- **Answer Styling**: Toned down wrong-answer highlighting during quiz (subtle red tint instead of full red background) while keeping strong green for correct answers.
- **Header Controls**: Moved save/bookmark icons to question card header instead of global header for better UX.
- **Results Page**: Enhanced with category breakdown, streaks tracking, and improved action buttons including "Review Missed Only" and "Retry Quiz (same settings)".

### Fixed
- **Reveal Timing**: Fixed quiz to never reveal correctness during the quiz in any mode - only in Summary for Exam mode, only after "Check Answer" for Practice mode.
- **Modal Styling**: Added proper backdrop blur and styling using design system tokens.
- **Safe Area Insets**: Enhanced mobile compatibility with proper safe-area padding for bottom navigation.

### Tests
- **Quiz Mode Tests**: Added comprehensive tests for Practice mode (no reveal until Check Answer) and Exam mode (no reveal during quiz).
- **Save/Exit/Resume Tests**: Added tests for localStorage persistence and resume functionality.
- **Review Flow Tests**: Added tests for Missed Only filtering and navigation from Results.

### Technical
- **Type Safety**: Maintained strict TypeScript with enhanced type checking and separate typecheck script.
- **Performance**: Optimized quiz state management and localStorage persistence for smooth resume experience.
- **Accessibility**: Enhanced ARIA attributes and keyboard navigation for modal interactions.

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
