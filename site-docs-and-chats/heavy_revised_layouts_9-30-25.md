# Surgical Tech Study App - Revised Layouts

## Page Schemas Overview
Updated schemas incorporate Claude's wireframes, ChatGPT's UI tweaks (e.g., iOS viewport fixes, neutral error states), and Supabase bindings. Adjustments for mismatches: Added auth guards to modals; refactored props to match schema types (e.g., UUIDs for IDs); Flagged conflict in review tabs (missed vs. bookmarked overlap) - fixed by separating into tabs with DB-derived counts.

| Page | Route | Key Components | DB Bindings | UI Tweaks & iOS Adaptations |
|------|--------|----------------|-------------|-----------------------------|
| Dashboard | /dashboard | ProgressRing, DailyProgress, QuickActionCards, CategoryPerformance | user_analytics (readiness score), study_sessions (streaks), user_responses (category %) | Non-floating header; safe-area padding; dvh for hero; pre-fill quiz config from weak areas. |
| Quiz Setup | /quiz/start | QuizConfig (inputs/dropdowns), ResumeCard | study_sessions (incomplete sessions), questions (categories) | Opaque selects; keyboard resize handling; confirm exit modal. |
| Active Quiz | /quiz/[id] | QuizQuestion, ProgressBar, BookmarkButton | quiz_sessions (config), user_responses (answers), questions (content) | Neutral incorrect states (border, not red fill); VisualViewport for keyboard; no back navigation. |
| Quiz Summary | /quiz/summary/[id] | SummaryStats, QuestionReviewCards | quiz_sessions (score), user_responses (correctness), bookmarks (add) | Expandable cards; Study links; safe-bottom for CTAs. |
| Review | /review | ReviewFilters, ReviewTabs (Missed, Bookmarked), QuestionReviewCards | user_question_stats (missed/bookmarked), resources (links) | Tabbed interface; virtualization for long lists; prefers-reduced-motion. |
| Study | /study | ResourceList, PlaylistBuilder, FlashcardDeck | resources, audio_content, medical_terms | Category filters; media controls with safe spacing; offline resilience. |
| Settings | /settings | ProfileForm, AnalyticsCharts, ToggleGroup | user_profiles (goals), auth (user data) | Opaque toggles/toasts; aria-live; system toasts integration. |

## Code Snippets
### Supabase Query Hook for Dashboard Progress
```typescript
// hooks/useUserProgress.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useUserProgress = () => {
  return useQuery(['user-progress'], async () => {
    const { data } = await supabase
      .from('user_responses')
      .select('is_correct, questions!inner(category)')
      .eq('user_id', supabase.auth.user().id);
    // Calculate overall and category percentages
    const overall = (data.filter(r => r.is_correct).length / data.length) * 100;
    return { overall };
  });
};
```

### iOS Viewport Adaptation in Layout
```tsx
// components/AppShell.tsx
import { useSafeAreas } from '@/hooks/useSafeAreas';

const AppShell = ({ children }) => {
  const insets = useSafeAreas();
  return (
    <div style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}>
      {children}
    </div>
  );
};
```

### Auth Guard for Quiz Modal
```tsx
// components/QuizModal.tsx
import { useAuth } from '@/hooks/useAuth';

const QuizModal = () => {
  const { user } = useAuth();
  if (!user) return <LoginPrompt />;
  // Quiz content...
};
```
