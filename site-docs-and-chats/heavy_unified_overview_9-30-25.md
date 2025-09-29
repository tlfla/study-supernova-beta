# Surgical Tech Study App - Unified Overview

## Purpose
The Surgical Tech Study App is a mobile-first web application designed to help surgical technologists prepare for their national certification exam. It addresses gaps in existing apps (e.g., NBSTSA, AST) by providing adaptive learning tools, including wrong answer review, audio study content, medical terminology flashcards, and comprehensive analytics. Initially targeting individual students, it plans expansion to educational institutions and other medical programs.

## Key Features
- **Smart Wrong Answer Review System**: Automatically tracks and revisits missed questions without overwhelming users.
- **Fresh Question Algorithm**: Ensures no repeats until the question bank (~1,800 questions across categories like General Surgery, Neurosurgery) is exhausted.
- **Bookmark System**: Allows users to flag questions for focused review.
- **Progress Tracking**: Visual readiness ring, category performance charts, study streaks, and daily goals.
- **Study Resources**: Flashcards, audio lessons, and procedure-specific content.
- **3-Version Question System**: Prevents memorization with varied question wordings.

## High-Level User Flows
1. **Onboarding & Dashboard**: Register/set exam date → View progress ring, daily stats, quick actions (e.g., Start Quiz, Review Missed).
2. **Quiz Taking**: Configure quiz (category, source: fresh/missed/bookmarked) → Answer questions with bookmarking → Immediate summary with explanations and bookmarks → Auto-add missed to review pool.
3. **Review & Study**: Filter bookmarked/missed questions → Study cards with explanations → Remove mastered items; Access flashcards/audio for deeper learning.
4. **Analytics & Settings**: View performance charts → Adjust goals/preferences → Export data or view quiz history for retakes.
5. **Resume/History**: Resume saved quizzes → Review past sessions and retake similar configurations.

## Integrations & Tech Stack
- **Backend**: Supabase (PostgreSQL for questions, user responses, sessions; Auth for users; RLS for data privacy; Storage for audio).
- **Frontend**: Next.js with Capacitor for mobile; Tailwind CSS; Zustand for state; Shadcn/ui components.
- **Analytics**: Mixpanel for tracking; Real-time sync via Supabase.
- **Other**: Google Cloud TTS for audio; Cloudflare CDN; Mixes mock data with real queries during transition.

## Alignment Notes
- All flows align with Supabase schema (e.g., `user_responses` tracks misses for review).
- iOS adaptations (viewport, safe areas) ensure responsive mobile experience.
- No major conflicts; proactively added auth guards to protected routes (e.g., quiz modals require login).
