import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, RotateCcw, Calendar, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import ProgressRing from '../components/common/ProgressRing'
import Button from '../components/common/Button'
import DesktopHeader from '../components/common/DesktopHeader'
import { getCategoryColor } from '../lib/categoryColors'
import { getPrimaryWithOpacity } from '../lib/colors'

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
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
        <DesktopHeader />
        
        {/* Mobile Branding Header - Dashboard Only */}
        <div 
          className="md:hidden bg-white border-b safe-area-padding-top"
          style={{ 
            height: '48px',
            borderColor: 'var(--stroke-soft)'
          }}
        >
          <div className="h-full flex items-center px-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-500)' }}
              >
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                PrepLift
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl md:max-w-6xl mx-auto px-4 pt-6 md:pt-24 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
          {/* Study Progress Card with Exam Countdown */}
          <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'white', boxShadow: 'var(--shadow-raised)', borderColor: 'var(--stroke-soft)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Study Progress
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: getPrimaryWithOpacity(0.1) }}>
                <Calendar className="w-4 h-4" style={{ color: 'var(--primary-600)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exam in</span>
                <span className="text-xl font-bold" style={{ color: 'var(--primary-600)' }}>{daysUntilExam}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>days</span>
              </div>
            </div>
            
            {/* Progress ring */}
            <div className="flex flex-col items-center py-6">
              <ProgressRing progress={readinessScore} size={120} />
              <p className="text-center text-base font-medium mt-4" style={{ color: 'var(--text-secondary)' }}>
                {readinessScore}% study completion
              </p>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="max-w-2xl mx-auto px-4 mb-6">
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="w-full"
                style={{
                  backgroundColor: 'var(--primary-500)',
                  color: 'white',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleReviewMissed}
                className="w-full"
                style={{
                  borderWidth: '2px',
                  borderColor: 'var(--primary-500)',
                  color: 'var(--primary-600)',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Review Missed Questions
              </Button>
            </div>
          </div>

          {/* Category Performance Snippet */}
          <div className="rounded-2xl border p-5 mb-6" style={{ backgroundColor: 'white', boxShadow: 'var(--shadow-raised)', borderColor: 'var(--stroke-soft)' }}>
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
                  <span className="text-sm font-bold" style={{ color: getCategoryColor(category.name) }}>
                    {category.score}%
                  </span>
                    </div>
                    <div 
                      className="h-3 rounded-full overflow-hidden" 
                      style={{ backgroundColor: 'var(--bg-raised)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${category.score}%`,
                          backgroundColor: getCategoryColor(category.name, 1)
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
