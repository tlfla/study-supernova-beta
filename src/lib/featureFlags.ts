export const featureFlags = {
  // Quiz behavior flags
  REVEAL_DURING_QUIZ: false,
  DIFFICULTY_LABELS: false,
  ALLOW_BACK_NAV: false,
  AUTOSAVE_PROGRESS: true,

  // Quiz mode flags
  ENABLE_EXAM_MODE: true,
  ENABLE_PRACTICE_MODE: true,

  // UI feature flags
  ENABLE_STUDY_AREA: true,
  ENABLE_BOOKMARKS: true,
  ENABLE_CATEGORY_PERFORMANCE: true,

  // Development flags
  USE_MOCK_DATA: true,
  ENABLE_DEBUG_MODE: false,
} as const

// Type-safe feature flag checker
export function isFeatureEnabled(flag: keyof typeof featureFlags): boolean {
  return featureFlags[flag]
}

// Environment variable override (for production)
if (import.meta.env.VITE_REVEAL_DURING_QUIZ !== undefined) {
  featureFlags.REVEAL_DURING_QUIZ = import.meta.env.VITE_REVEAL_DURING_QUIZ === 'true'
}

if (import.meta.env.VITE_DIFFICULTY_LABELS !== undefined) {
  featureFlags.DIFFICULTY_LABELS = import.meta.env.VITE_DIFFICULTY_LABELS === 'true'
}

if (import.meta.env.VITE_ALLOW_BACK_NAV !== undefined) {
  featureFlags.ALLOW_BACK_NAV = import.meta.env.VITE_ALLOW_BACK_NAV === 'true'
}

if (import.meta.env.VITE_AUTOSAVE_PROGRESS !== undefined) {
  featureFlags.AUTOSAVE_PROGRESS = import.meta.env.VITE_AUTOSAVE_PROGRESS === 'true'
}

if (import.meta.env.VITE_ENABLE_EXAM_MODE !== undefined) {
  featureFlags.ENABLE_EXAM_MODE = import.meta.env.VITE_ENABLE_EXAM_MODE === 'true'
}

if (import.meta.env.VITE_USE_MOCK_DATA !== undefined) {
  featureFlags.USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
}
