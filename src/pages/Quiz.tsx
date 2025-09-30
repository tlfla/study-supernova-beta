import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bookmark, Clock, Flag, Save, X, CheckCircle, XCircle } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { getCategoryColor } from '../lib/categoryColors'
import { getPrimaryWithOpacity } from '../lib/colors'

function getCategoryColorLegacy(category: string, opacity: number = 1) {
  const colors: Record<string, string> = {
    'Anatomy & Physiology': '#E85D75',
    'Microbiology': '#4CAF82',
    'Pharmacology': '#4A9FE8',
    'Sterilization and Decontamination': '#8B7BC7',
    'Cardiovascular': '#E85D6B',
    'General Surgery': '#6B7280',
    'Genitourinary': '#F5B947',
    'Neurology': '#5A7C99',
    'Ophthalmic': '#FF9F5A',
    'Orthopedic': '#5BA3D4',
    'Otorhinolaryngology': '#64B5F6',
    'Peripheral Vascular': '#F08C84',
    'Plastics and Reconstructive': '#EDAD5C',
    'Obstetrics and Gynecology': '#E88A8A',
    'Preoperative': '#52C9B0',
    'Postoperative': '#F4D03F',
    'Professional and Administrative Responsibilities': '#B591D6'
  };
  
  const baseColor = colors[category] || '#11B5A4';
  
  if (opacity < 1) {
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return baseColor;
}

// Note: Remove getCategoryColorLegacy after testing - using shared utility now

export default function Quiz() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showQuitModal, setShowQuitModal] = useState(false)

  const quizState = state.quizState
  const quizSettings = state.quizSettings
  const currentQuestion = quizState?.questions[quizState.currentQuestionIndex]
  const currentAnswer = quizState?.answers[currentQuestion?.id || '']

  // Check if we're in practice mode and should show feedback
  const isPracticeMode = quizSettings?.mode === 'practice'
  const isExamMode = quizSettings?.mode === 'exam'
  const shouldShowFeedback = isPracticeMode ? showFeedback : false

  useEffect(() => {
    if (!quizState || !currentQuestion) {
      navigate('/quiz-options')
      return
    }

    // Check if current question is bookmarked
    const checkBookmark = async () => {
      if (state.currentUser) {
        const bookmarked = await dataProvider.isBookmarked(state.currentUser.id, currentQuestion.id)
        setIsBookmarked(bookmarked)
      }
    }

    checkBookmark()
  }, [currentQuestion, state.currentUser])

  useEffect(() => {
    // Timer effect
    if (!quizState || quizState.isComplete) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000)
      setTimeElapsed(elapsed)

      // Update time remaining if there's a time limit
      if (quizState.timeRemaining) {
        const remaining = Math.max(0, quizState.timeRemaining - elapsed * 1000)
        dispatch({ type: 'SET_TIME_REMAINING', payload: remaining })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [quizState, dispatch])

  if (!quizState || !currentQuestion) {
    return null
  }

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswer(answer)

    // In exam mode, just record the answer and don't show feedback
    if (!isPracticeMode) {
      // Save the answer
      dispatch({
        type: 'ANSWER_QUESTION',
        payload: { questionId: currentQuestion.id, answer }
      })

      // Record the response
      if (state.currentUser) {
        dataProvider.saveResponse({
          id: `response-${Date.now()}`,
          userId: state.currentUser.id,
          questionId: currentQuestion.id,
          answer,
          isCorrect: answer === currentQuestion.correct,
          timeSpentSec: timeElapsed,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !isPracticeMode) return

    setShowFeedback(true)

    // Save the answer
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId: currentQuestion.id, answer: selectedAnswer }
    })

    // Record the response
    if (state.currentUser) {
      dataProvider.saveResponse({
        id: `response-${Date.now()}`,
        userId: state.currentUser.id,
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect: selectedAnswer === currentQuestion.correct,
        timeSpentSec: timeElapsed,
        timestamp: new Date().toISOString()
      })
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' })
    } else {
      dispatch({ type: 'COMPLETE_QUIZ' })
      navigate('/results')
    }
  }

  const handlePrevious = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    dispatch({ type: 'PREVIOUS_QUESTION' })
  }

  const handleBookmarkToggle = async () => {
    if (!state.currentUser) return

    const newBookmarkState = await dataProvider.toggleBookmark(currentQuestion.id)
    setIsBookmarked(newBookmarkState)
  }

  const handleQuitClick = () => {
    setShowQuitModal(true)
  }

  const handleExitWithoutSaving = () => {
    localStorage.removeItem('savedQuiz')
    dispatch({ type: 'RESET_QUIZ' })
    navigate('/')
  }

  const handleSaveAndExit = () => {
    if (!quizState || !quizSettings) return

    // Save quiz state to localStorage
    const savedQuizState = {
      questions: quizState.questions,
      currentQuestionIndex: quizState.currentQuestionIndex,
      answers: quizState.answers,
      startTime: quizState.startTime,
      settings: quizSettings,
      timestamp: Date.now()
    }

    localStorage.setItem('savedQuiz', JSON.stringify(savedQuizState))
    setShowQuitModal(false)

    // Navigate back to dashboard
    navigate('/')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeRemaining = (milliseconds: number) => {
    const seconds = Math.ceil(milliseconds / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100

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
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-raised)', borderColor: 'var(--stroke-soft)' }}>
          {/* Question Header */}
          <div className="mb-6">
            <div className="mb-4">
              <span 
                className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: getCategoryColor(currentQuestion.category, 0.15),
                  color: getCategoryColor(currentQuestion.category, 1)
                }}
              >
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {(['A', 'B', 'C', 'D'] as const).map((option) => {
              const isSelected = selectedAnswer === option
              const isCorrect = option === currentQuestion.correct
              const showingFeedback = shouldShowFeedback
              
              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={shouldShowFeedback}
                  className="w-full p-4 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: isSelected && !showingFeedback ? 'var(--primary-500)' : 'var(--border-muted)',
                    backgroundColor: isSelected && !showingFeedback ? 'rgba(17, 181, 164, 0.1)' : 'white',
                    ...(showingFeedback && isCorrect && { borderColor: 'var(--success-500)' }),
                    ...(showingFeedback && isSelected && !isCorrect && { backgroundColor: 'var(--wrong-answer-bg)', borderColor: 'var(--danger-500)' })
                  }}
                  onMouseEnter={(e) => {
                    if (!shouldShowFeedback && !isSelected) {
                      e.currentTarget.style.borderColor = 'var(--primary-400)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!shouldShowFeedback && !isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border-muted)'
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm"
                      style={{
                        borderColor: isSelected && !showingFeedback ? 'var(--primary-500)' : 'var(--border-muted)',
                        backgroundColor: isSelected && !showingFeedback ? 'var(--primary-500)' : 'transparent',
                        color: isSelected && !showingFeedback ? 'white' : 'var(--text-secondary)',
                        ...(showingFeedback && isCorrect && { borderColor: 'var(--success-500)', backgroundColor: 'var(--success-500)', color: 'white' }),
                        ...(showingFeedback && isSelected && !isCorrect && { borderColor: 'var(--danger-500)', backgroundColor: 'var(--danger-500)', color: 'white' })
                      }}
                    >
                      {option}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {currentQuestion.options[option]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback - only in practice mode */}
          {shouldShowFeedback && (
            <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div 
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ 
                    backgroundColor: selectedAnswer === currentQuestion.correct 
                      ? 'var(--success)' 
                      : 'var(--warning-500)' 
                  }}
                >
                  {selectedAnswer === currentQuestion.correct ? '✓' : 'i'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Review Answer'}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {isPracticeMode ? (
              // Practice mode: Check Answer or Next
              shouldShowFeedback ? (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-all"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
                >
                  {quizState.currentQuestionIndex === quizState.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                  <ArrowRight className="inline h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                  onMouseEnter={(e) => !selectedAnswer ? null : e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                  onMouseLeave={(e) => !selectedAnswer ? null : e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
                >
                  Check Answer
                </button>
              )
            ) : (
              // Exam mode: always just Next
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl text-white font-semibold transition-all"
                style={{ backgroundColor: 'var(--primary-500)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
              >
                {quizState.currentQuestionIndex === quizState.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                <ArrowRight className="inline h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div> {/* Close max-w-2xl */}
    </div> {/* Close overflow-y-auto */}

    {/* Quit Modal */}
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
  </div>
  )
}
