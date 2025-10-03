import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Home, ArrowRight } from 'lucide-react'
import { FlashcardData, terminologyFlashcards, instrumentsFlashcards, anatomyFlashcards } from '../data/flashcardsData'
import { getCategoryColor } from '../lib/categoryColors'
import { useAppContext } from '../state/AppContext'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'

type FlashcardType = 'terminology' | 'instruments' | 'anatomy'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  return isMobile
}

const useSwipeNavigation = (
  onNext: () => void,
  onPrevious: () => void,
  canGoNext: boolean,
  canGoPrevious: boolean
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && canGoNext) {
      onNext()
    }
    if (isRightSwipe && canGoPrevious) {
      onPrevious()
    }
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}

export default function Flashcards() {
  const navigate = useNavigate()
  const { type } = useParams<{ type: FlashcardType }>()
  const { dispatch } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Get flashcard data based on type
  const getFlashcards = (): FlashcardData[] => {
    switch (type) {
      case 'terminology':
        return terminologyFlashcards
      case 'instruments':
        return instrumentsFlashcards
      case 'anatomy':
        return anatomyFlashcards
      default:
        return terminologyFlashcards
    }
  }

  const flashcards = getFlashcards()
  const currentCard = flashcards[currentIndex]

  const getTitle = () => {
    switch (type) {
      case 'terminology':
        return 'Medical Terminology'
      case 'instruments':
        return 'Surgical Instruments'
      case 'anatomy':
        return 'Anatomy & Physiology'
      default:
        return 'Flashcards'
    }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    if (type !== 'terminology') {
      setIsFlipped(!isFlipped)
    }
  }

  const handleAudioPlay = () => {
    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        type: 'info',
        title: 'Audio Coming Soon',
        message: 'Pronunciation audio will be available in a future update.'
      }
    })
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleFlip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isFlipped])

  // Swipe gesture hook
  const swipeHandlers = useSwipeNavigation(
    handleNext,
    handlePrevious,
    currentIndex < flashcards.length - 1,
    currentIndex > 0
  )

  const progress = ((currentIndex + 1) / flashcards.length) * 100
  const isLastCard = currentIndex === flashcards.length - 1

  const getInstructionText = () => {
    if (isMobile) {
      return 'Swipe to navigate'
    }
    if (type !== 'terminology') {
      return 'Use arrow keys to navigate • Space/Enter to flip'
    }
    return 'Use arrow keys to navigate'
  }

  const getCardActionText = () => {
    return isMobile ? 'Tap to reveal answer' : 'Click to reveal answer'
  }

  return (
    <div className="min-h-screen-safe" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title={getTitle()} />
      <DesktopHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-28 pb-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/study')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            aria-label="Back to Study page"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Study</span>
          </button>

          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className="h-2 rounded-full mb-8 overflow-hidden"
          style={{ backgroundColor: 'var(--bg-raised)' }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--primary-500)'
            }}
          />
        </div>

        {/* Flashcard */}
        <div
          ref={cardRef}
          {...swipeHandlers}
          className="mb-8"
          style={{ perspective: '1000px' }}
        >
          <div
            className={`relative transition-transform duration-500`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: type === 'terminology' ? '300px' : '400px'
            }}
          >
            {/* Front of Card */}
            <div
              className={`rounded-2xl border p-6 ${type !== 'terminology' ? 'cursor-pointer' : ''}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-raised)',
                borderColor: 'var(--stroke-soft)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
              onClick={type !== 'terminology' ? handleFlip : undefined}
            >
              {/* Category Pill */}
              <div className="mb-4">
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: getCategoryColor(currentCard.category, 0.15),
                    color: getCategoryColor(currentCard.category)
                  }}
                >
                  {currentCard.category}
                </span>
              </div>

              {type === 'terminology' ? (
                // Terminology Card (No Flip)
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      {currentCard.term}
                    </h2>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {currentCard.definition}
                    </p>
                  </div>

                  {/* Audio Button */}
                  <button
                    onClick={handleAudioPlay}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: 'var(--primary-500)',
                      color: 'var(--primary-600)',
                      backgroundColor: 'rgba(17, 181, 164, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.1)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.05)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="font-semibold">Pronunciation</span>
                  </button>
                </div>
              ) : (
                // Visual Cards (Front)
                <div className="flex flex-col items-center justify-center min-h-[320px]">
                  {/* Image Placeholder */}
                  <div
                    className="w-full max-w-md h-48 rounded-xl mb-6 flex items-center justify-center"
                    style={{
                      backgroundColor: getCategoryColor(currentCard.category, 0.15)
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: getCategoryColor(currentCard.category) }}>
                      [Image: {currentCard.answer}]
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
                    {currentCard.question}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {getCardActionText()}
                  </p>
                </div>
              )}
            </div>

            {/* Back of Card (Only for visual cards) */}
            {type !== 'terminology' && (
              <div
                className="absolute inset-0 rounded-2xl border p-6 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-raised)',
                  borderColor: 'var(--stroke-soft)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
                onClick={handleFlip}
              >
                {/* Category Pill */}
                <div className="mb-4">
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(currentCard.category, 0.15),
                      color: getCategoryColor(currentCard.category)
                    }}
                  >
                    {currentCard.category}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[320px]">
                  <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                    {currentCard.answer}
                  </h2>
                  <p className="text-lg text-center leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                    {currentCard.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentIndex === 0 ? 'var(--bg-raised)' : 'white',
              border: '2px solid var(--stroke-soft)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              if (currentIndex > 0) {
                e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {isLastCard ? (
            <button
              onClick={() => navigate('/study')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: 'var(--primary-500)',
                border: '2px solid var(--primary-500)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                e.currentTarget.style.borderColor = 'var(--primary-600)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                e.currentTarget.style.borderColor = 'var(--primary-500)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label="Back to Study page"
            >
              <span>Back to Study</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: 'var(--primary-500)',
                border: '2px solid var(--primary-500)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                e.currentTarget.style.borderColor = 'var(--primary-600)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                e.currentTarget.style.borderColor = 'var(--primary-500)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label="Next card"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Device-Specific Instructions */}
        <div className="mt-8 flex justify-center">
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(100, 116, 139, 0.1)',
              color: 'var(--text-secondary)'
            }}
          >
            {getInstructionText()}
          </span>
        </div>
      </div>
    </div>
  )
}
