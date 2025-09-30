# Quiz Page Critical Fixes - Implementation Guide

**Status**: READY TO APPLY  
**File**: `src/pages/Quiz.tsx`  
**Priority**: HIGH - User-reported issues

---

## CURRENT STATE ANALYSIS

The current Quiz.tsx file structure (based on reading lines 155-270):
- Has old `handleSaveAndExit()` function already (lines 181-194)
- Uses `setShowSaveExitModal` for quit modal
- Has cluttered header with multiple elements
- Progress bar integrated into header
- Old styling with Tailwind classes (bg-gray-50, border-gray-200)

---

## REQUIRED CHANGES

### Change 1: Update State & Handlers

**Find** (around line 48):
```typescript
const [showSaveExitModal, setShowSaveExitModal] = useState(false)
```

**Replace with**:
```typescript
const [showQuitModal, setShowQuitModal] = useState(false)
```

**Then find** references to `setShowSaveExitModal(true)` and replace with `setShowQuitModal(true)`

**Add new handler** (after `handleBookmarkToggle`):
```typescript
const handleQuitClick = () => {
  setShowQuitModal(true)
}

const handleExitWithoutSaving = () => {
  localStorage.removeItem('savedQuiz')
  dispatch({ type: 'RESET_QUIZ' })
  navigate('/')
}
```

---

### Change 2: Replace Entire Header Section

**Find** (lines 217-272 approximately):
```typescript
return (
  <div className="min-h-screen-safe bg-gray-50 pb-safe">
    {/* Header */}
    <div className="bg-white shadow-sm border-b border-gray-200 safe-area-padding-top">
      ... entire old header ...
    </div>
```

**Replace with**:
```typescript
return (
  <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
    {/* Layer 1: Minimal Header - Quit Only */}
    <div className="sticky top-0 z-50 border-b" style={{
      backgroundColor: 'white',
      borderColor: 'var(--border-muted)',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px'
    }}>
      <button 
        onClick={handleQuitClick}
        className="p-2 -ml-2 rounded-lg transition-colors"
        style={{ 
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getPrimaryWithOpacity(0.1)}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        aria-label="Quit quiz"
      >
        <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
      </button>
    </div>

    {/* Layer 2: Control Bar - Stats & Actions */}
    <div className="sticky z-40 border-b px-4 py-3" style={{
      top: '56px',
      backgroundColor: 'var(--bg-raised)',
      borderColor: 'var(--stroke-soft)'
    }}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" 
             style={{ backgroundColor: 'white', border: '1px solid var(--stroke-soft)' }}>
          <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatTime(timeElapsed)}
          </span>
        </div>

        {/* Question Counter */}
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Question <span style={{ color: 'var(--primary-600)' }}>{quizState.currentQuestionIndex + 1}</span> of {quizState.questions.length}
        </div>

        {/* Bookmark */}
        <button 
          onClick={handleBookmarkToggle}
          className="p-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: isBookmarked ? 'rgba(255, 180, 54, 0.1)' : 'transparent',
            border: '1px solid',
            borderColor: isBookmarked ? 'var(--bookmark-500)' : 'var(--stroke-soft)'
          }}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark 
            className="w-5 h-5" 
            style={{ color: isBookmarked ? 'var(--bookmark-500)' : 'var(--text-secondary)' }}
            fill={isBookmarked ? 'var(--bookmark-500)' : 'none'}
          />
        </button>
      </div>
    </div>

    {/* Layer 3: Progress Bar */}
    <div className="sticky h-2" style={{ 
      top: '113px',
      zIndex: 40,
      backgroundColor: '#E5E7EB'
    }}>
      <div 
        className="h-full transition-all duration-300"
        style={{
          width: `${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%`,
          backgroundColor: 'var(--primary-500)'
        }}
      />
    </div>
```

---

### Change 3: Update Content Wrapper

**Find** (around line 275):
```typescript
{/* Question Content */}
<div className="max-w-4xl mx-auto px-4 py-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
```

**Replace with**:
```typescript
{/* Question Content Area - starts after all fixed elements */}
<div 
  className="overflow-y-auto"
  style={{ 
    paddingTop: '131px',
    paddingBottom: '24px',
    minHeight: '100vh'
  }}
>
  <div className="max-w-2xl mx-auto px-4 py-6">
```

**Then at the end of question content, close both divs**:
```typescript
        </div> {/* Close max-w-2xl */}
      </div> {/* Close overflow-y-auto */}
```

---

### Change 4: Replace Modal Section

**Find** the existing modal (search for `showSaveExitModal`):
```typescript
{showSaveExitModal && (
  <Modal ... >
    ...
  </Modal>
)}
```

**Replace with**:
```typescript
{showQuitModal && (
  <div 
    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    onClick={() => setShowQuitModal(false)}
  >
    <div 
      className="rounded-2xl shadow-xl max-w-md w-full"
      style={{ backgroundColor: 'white' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--stroke-soft)' }}>
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Save progress and exit?
        </h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your current quiz will be saved so you can resume later.
        </p>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        {/* Primary: Save & Exit */}
        <button
          onClick={handleSaveAndExit}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-colors"
          style={{
            backgroundColor: 'var(--primary-500)',
            color: 'white'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
        >
          Save & Exit
        </button>

        {/* Secondary: Exit Without Saving */}
        <button
          onClick={handleExitWithoutSaving}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-colors"
          style={{
            border: '2px solid var(--danger-500)',
            color: 'var(--danger-700)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--danger-500)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--danger-700)';
          }}
        >
          Exit Without Saving
        </button>

        {/* Tertiary: Cancel */}
        <button
          onClick={() => setShowQuitModal(false)}
          className="w-full py-3 px-4 rounded-xl font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-raised)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
```

---

### Change 5: Remove Unused Imports

Remove from imports if present:
- `Button` from '../components/common/Button' (if not used elsewhere)
- `Modal` from '../components/common/Modal' (if not used elsewhere)
- `Flag` icon (if not used elsewhere)

Keep: `X`, `Clock`, `Bookmark`, `CheckCircle`, `XCircle`

---

## VERIFICATION CHECKLIST

After applying changes, verify:

- [ ] Quiz header shows only X icon (no "Quit Quiz" text)
- [ ] Control bar shows timer, question counter, bookmark in organized row
- [ ] Progress bar is visible below control bar
- [ ] Clicking X opens modal with 3 buttons
- [ ] "Save & Exit" button works
- [ ] "Exit Without Saving" button works
- [ ] "Cancel" button closes modal
- [ ] Bottom nav is hidden (already implemented in BottomTabBar.tsx)
- [ ] Question content doesn't overlap headers
- [ ] All hover states work

---

## NOTES

1. **BottomTabBar hide logic**: Already implemented ✅
2. **getCategoryColor**: Already using shared utility ✅
3. **getPrimaryWithOpacity**: Already imported ✅
4. **formatTime function**: Already exists ✅
5. **handleSaveAndExit**: Already exists, just need handleExitWithoutSaving ✅

---

## QUICK REFERENCE: Line Numbers to Change

Based on current file structure:
- **Line ~48**: State declaration (showSaveExitModal → showQuitModal)
- **Lines 180-210**: Handlers section (add new handlers)
- **Lines 217-272**: Entire header section (replace completely)
- **Line ~275**: Content wrapper (update padding)
- **Lines ~440+**: Modal section (replace completely)

---

**IMPLEMENTATION TIME**: ~15 minutes  
**TESTING TIME**: ~5 minutes  
**TOTAL**: ~20 minutes
