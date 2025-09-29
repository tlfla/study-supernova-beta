# APPEND: UI/UX Alignment Addendum — Surgical Tech Study App (Aligned Names)
_Last updated: 2025-09-29 17:48 (ET)_

> **Purpose.** This addendum supersedes the prior append file and **aligns naming and scope 1:1** with your current docs (`integration_guide.md`, `revised_layouts.md`, `unified_overview.md`). It preserves the same UI/UX decisions but standardizes DB table and source labels for Cursor/Grok.

---

## 1) What Changed vs. Previous Append (Naming/Scope Only)
- **Tables standardized:** `quiz_sessions` (session config/status), `user_responses` (answers), `user_question_stats` (missed/bookmarks).  
- **Review scope clarified:** Review includes **two tabs** → **Missed** and **Bookmarked** (your plan text said Bookmarked-only earlier; this reflects current UI + schema).
- **Source labels unified:** `fresh | missed | bookmarked | all_available` (UI may show “All available” text; it maps directly to `all_available`).

_No behavioral changes were introduced here—only naming/scope normalization._

---

## 2) Feature Correlation Matrix (Aligned)
| Plan Feature | UI/UX Spec Mapping | Route(s) | DB / RPC |
|---|---|---|---|
| Configurable Quizzes (category/source/count) | Quiz Start gateway with opaque selects; source: `fresh | missed | bookmarked | all_available` | `/quiz/start` | `quiz_sessions` (config), RPC `get_quiz_questions(config)` |
| Save/Resume Sessions | “Resume Saved” CTA if an active session exists | `/quiz/start`, `/quiz/active` | `quiz_sessions.status`, recent active by user |
| Wrong-Answer Review | Neutral reveal (no red fill), rationale microcopy; auto-add to missed pool | `/quiz/active`, `/review` | `user_responses` (insert), `user_question_stats.in_missed_pool=true` |
| Bookmark Review | Separate **Bookmarked** tab + filters | `/review` | `user_question_stats.is_bookmarked=true` |
| Study Bridge from Review | Inline links to resources/audio/terms | `/review` → `/study` | `resources`, `audio_content`, `medical_terms` |
| Analytics (ring, performance, trends) | Dashboard cards + readiness ring | `/dashboard` | `user_analytics` aggregates |
| Institutional & Auth | Join class, protected routes | `/settings` (+ auth guards) | Supabase Auth + RLS |

---

## 3) Route → DB/Schema Binding (MVP, Aligned Names)
- **/dashboard**
  - `user_analytics.overall`, `user_analytics.category_performance`
  - Recent activity from `quiz_sessions` (latest by `updated_at` for the user)
- **/quiz/start**
  - Create/continue in `quiz_sessions` with `quiz_config` (category, question_source=`fresh|missed|bookmarked|all_available`, total_questions)
  - Validate/preview via RPC `get_quiz_questions(config)` (server-side dedupe/no duplicates per session)
- **/quiz/active**
  - Persist answers to `user_responses` (one per question per session)
  - Update `user_question_stats` counters and flags: `times_seen`, `times_missed`, `in_missed_pool`, `is_bookmarked`
  - Update `quiz_sessions.status/progress` (e.g., current index, answered count)
- **/quiz/summary**
  - Join `user_responses` ↔ `questions` for correctness/explanations
  - Bookmark add/remove toggles write to `user_question_stats.is_bookmarked`
- **/review**
  - Two tabs: **Missed** (`user_question_stats.in_missed_pool=true`), **Bookmarked** (`is_bookmarked=true`)
  - Each item surfaces Study links from `resources`, `audio_content`, `medical_terms`
- **/study**
  - `medical_terms` + `user_term_progress`
  - `audio_content` + `user_audio_progress`
- **/settings**
  - `user_profiles` (goals/prefs), Supabase Auth; instructor/class entries later

> **RLS:** `questions` readable (active only). All per-user tables scoped by `user_id`. RPC must filter by current user + active questions.

---

## 4) iOS 26 Implementation Directives (unchanged behavior)
- **Meta:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">`
- **Safe Areas:** Utilities `.safe-top/.safe-bottom/.safe-left/.safe-right` using `env(safe-area-inset-*)`, applied to **Header** & **TabBar**.
- **Viewport Height:** Prefer `min-h-[100dvh]`; include a JS fallback to set `--vh` for older Safari if needed.
- **Keyboard:** VisualViewport listeners to avoid overlap; rely on `interactive-widget=resizes-content` primarily.
- **Motion:** Honor `prefers-reduced-motion`; use opacity-only transitions (<150ms) in reduced mode.
- **Dropdowns/Modals:** Opaque surfaces, correct stacking context; no translucent overlapping selects.

---

## 5) UI Tokens (Final Map)
```css
:root {
  --primary-700:#0D8E83; --primary-600:#0FA396; --primary-500:#11B5A4; --primary-400:#3BC6B8; --primary-300:#6ED7CC;
  --ios-primary:#007AFF;
  --bookmark-500:#FFB436; --bookmark-600:#E2A52F;
  --success-500:#2DC98A; --warning-500:#FFC85C; --danger-500:#FF6B6B; --info-500:#38BDF8;
  --surface-0:#FFFFFF; --surface-1:rgba(255,255,255,0.96);
  --text-strong:#0B1215; --text-muted:#4B5B66;
}
html { -webkit-text-size-adjust: 100%; }
h1,h2,h3 { line-height: 1.2 }
.text-title { font-size: clamp(18px,3.8vw,22px) }
.text-body { font-size: clamp(14px,3.2vw,16px) }
```

---

## 6) Grok Automation (Cursor) — Safe Apply (Aligned)
1. Head/meta injection + `safe-*` utilities; convert tallest containers to `min-h-[100dvh]` (+ fallback if required).
2. Route guard: `/quiz/active` requires an **active** `quiz_sessions` row; otherwise redirect to `/quiz/start`.
3. Replace any answer `.bg-red*` styling with **border/underline** neutral states + rationale microcopy (no red fill during quiz).
4. Review cards: show Study links where available; tabs = **Missed**/**Bookmarked**.
5. Desktop icon pass: icon opacity ≈ 0.9; add hover/focus tooltips; keep calmer opacity on mobile.
6. Restore “Resume Saved” on `/quiz/start` when an active session exists for the user.
7. Confirm-exit on quiz routes; auto-bypass if no answers recorded yet in `user_responses` for the session.

---

## 7) Acceptance Criteria (UI/UX, Aligned)
- Non-floating global header; TabBar respects bottom safe-area and remains visible with keyboard.
- Quiz always starts at `/quiz/start`; selects are opaque and do not overlap.
- Incorrect answers never use solid red backgrounds during quizzes.
- Review has **Missed** and **Bookmarked** tabs; each item exposes Study links when present.
- Settings toggles and toasts are opaque, accessible, and clearly legible.
- iOS notched/keyboard scenarios do not clip UI; Lighthouse a11y ≥ 90.
- Supabase bindings match the **aligned names**: `questions`, `quiz_sessions`, `user_responses`, `user_question_stats`, `resources`, `audio_content`, `medical_terms`, `user_profiles`, `user_analytics`.

---

## 8) Outstanding Items
- Android parity for dynamic viewport/keyboard; validate on Pixel notch devices.
- Results screen regression: re-check bindings for summary text and “Bookmark All” highlight toggle.
- Audio progress hook: sync `user_audio_progress.last_position_seconds` on play/pause/seek reliably.
- Virtualize long lists on `/review` and `/study` beyond ~200 items.
- Iconography audit: standardize 24px grid, 2px strokes, baseline alignment.

---

## 9) Quick Code Inserts (Aligned)

**Head meta (Next.js layout):**
```tsx
// In <head> of root layout:
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
```

**Safe-area utilities (global CSS):**
```css
.safe-top{padding-top:max(16px, env(safe-area-inset-top));}
.safe-bottom{padding-bottom:max(16px, env(safe-area-inset-bottom));}
.safe-left{padding-left:env(safe-area-inset-left);}
.safe-right{padding-right:env(safe-area-inset-right);}
```

**Route guard (pseudo):**
```ts
if (!activeQuizSessionForUser) router.replace('/quiz/start');
```

---

### TL;DR
Same UI/UX decisions, now **name-aligned**: `quiz_sessions`, `user_responses`, `user_question_stats`, and source label `all_available`. Review is explicitly **Missed + Bookmarked** tabs, matching your latest docs and schema.
