# Surgical Tech Study App - Integration Guide

## Code Edits & Diffs
Proactive fixes: Added RLS policies to prevent data leaks; Refactored mock data to Supabase queries; Flagged viewport conflict (user-scalable=no removed for accessibility) - fixed with pinch zoom enabled.

### Supabase Wiring in Hooks (Example Diff)
```
// hooks/useQuiz.ts (before)
const useQuiz = () => mockQuestions();

// after
import { supabase } from '@/lib/supabase';

const useQuiz = (config) => {
  return useQuery(['quiz', config], async () => {
    const { data } = await supabase.rpc('get_quiz_questions', {
      p_user_id: supabase.auth.user().id,
      p_category: config.category,
      p_source_type: config.source,
      p_limit: config.count
    });
    return data;
  });
};
```

### Viewport Meta in index.html
```
<!-- before -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- after -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### Auth Guard Edit in Routes
```
// routes.tsx (diff)
+ import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Component />;
};
```

## Build & Test Plan
### Build Steps
1. Install dependencies: `npm install`.
2. Set Supabase env vars: `.env` with `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Generate types: `npx supabase gen types typescript --local > types/supabase.ts`.
4. Build: `npm run build`.
5. Deploy: Use Vercel/Netlify with Supabase integration.

### Test Plan
- **Unit**: Test hooks/queries with Jest (e.g., mock Supabase responses for progress calc).
- **Integration**: Cypress for flows (quiz start → summary → review); Validate DB writes (e.g., missed questions added).
- **E2E**: Test iOS Simulator (Safari) for viewport/keyboard; Check auth guards prevent unauthed access.
- **Edge Cases**: Offline mode, resume after interrupt, category performance with 0 attempts.
- **Manual**: Cross-browser (Chrome, Safari); Device testing for safe areas.
