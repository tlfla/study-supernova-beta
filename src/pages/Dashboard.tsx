import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, RotateCcw, Calendar, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import ProgressRing from '../components/common/ProgressRing'
import Button from '../components/common/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()
  const [savedQuizData, setSavedQuizData] = useState<any>(null)
  const [categoryPerformanceExpanded, setCategoryPerformanceExpanded] = useState(false)

  useEffect(() => {
    // Check for saved quiz data
    const saved = localStorage.getItem('savedQuiz')
    if (saved) {
      try {
        setSavedQuizData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved quiz data:', e)
        localStorage.removeItem('savedQuiz')
      }
    }
  }, [])

  const handleStartQuiz = () => {
    // Clear any saved quiz data when starting new
    localStorage.removeItem('savedQuiz')
    navigate('/quiz-options')
  }

  const handleResumeQuiz = () => {
    if (!savedQuizData) return

    // Restore quiz state
    dispatch({
      type: 'RESUME_QUIZ',
      payload: {
        questions: savedQuizData.questions,
        settings: savedQuizData.settings,
        currentIndex: savedQuizData.currentQuestionIndex,
        answers: savedQuizData.answers,
        startTime: savedQuizData.startTime
      }
    })

    // Navigate to quiz
    navigate('/quiz')

    // Clean up saved data after resuming
    localStorage.removeItem('savedQuiz')
  }

  const handleReviewMissed = () => {
    navigate('/review')
  }

  const handleStudyResources = () => {
    navigate('/study')
  }

  const daysUntilExam = 30 // Mock data
  const readinessScore = 75 // Mock data

  return (
    <div className="min-h-screen-safe bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 safe-area-padding-top">
        <div className="max-w-7xl mx-auto px-4 py-6 safe-area-padding-left safe-area-padding-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Surgical Tech Study
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Exam Progress */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Exam Progress</h2>
            <Calendar className="h-6 w-6 text-primary-500" />
          </div>

          <div className="space-y-6">
            {/* Days to Exam Bar */}
            <div className="px-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Days until exam
                </span>
                <span 
                  className="text-2xl font-bold px-3 py-1 rounded-lg" 
                  style={{ 
                    color: 'var(--text-primary)', 
                    backgroundColor: 'rgba(255, 255, 255, 0.6)' 
                  }}
                >
                  {daysUntilExam}
                </span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center justify-center">
              <ProgressRing progress={readinessScore} size={120} />
            </div>
            <p className="text-center text-base font-medium mt-4" style={{ color: 'var(--text-secondary)' }}>
              {readinessScore}% study completion
            </p>
          </div>
        </Card>

        {/* Main Action Buttons - 2 Centered */}
        <div className="flex flex-col gap-3 px-8 mt-6 mb-8 max-w-2xl mx-auto">
          <button 
            onClick={handleStartQuiz}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'var(--primary-500)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
            onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'}
            onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-raised)'}
          >
            <Play className="inline mr-2 h-5 w-5" />
            Start Quiz
          </button>
          
          <button 
            onClick={handleReviewMissed}
            className="w-full py-3.5 rounded-xl font-semibold text-base shadow-sm transition-all active:scale-[0.98]"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--primary-600)', 
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--primary-400)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)'
            }}
          >
            <RotateCcw className="inline mr-2 h-5 w-5" />
            Review Missed
          </button>
        </div>

        {/* Category Performance Snippet */}
        <div 
          className="rounded-2xl p-5" 
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            boxShadow: 'var(--shadow-raised)' 
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Top Categories
            </h3>
            <button 
              onClick={() => navigate('/profile#performance')}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--primary-500)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-500)'}
            >
              View all →
            </button>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Anatomy & Physiology', score: 85 },
              { name: 'Surgical Procedures', score: 78 },
              { name: 'Instrumentation', score: 92 }
            ].map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {category.name}
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--primary-600)' }}>
                    {category.score}%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden" 
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${category.score}%`,
                      backgroundColor: 'var(--primary-500)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
