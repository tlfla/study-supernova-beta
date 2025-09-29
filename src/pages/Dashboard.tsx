import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, RotateCcw, Calendar, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import ProgressRing from '../components/common/ProgressRing'
import Button from '../components/common/Button'

function getCategoryColor(category: string): string {
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
    'Professional and Administrative Responsibilities': '#B591D6',
    'Surgical Procedures': '#6B7280',
    'Instrumentation': '#5BA3D4',
    'Patient Care': '#52C9B0',
    'Medical Ethics': '#B591D6',
    'Emergency Procedures': '#E85D6B',
    'Post-Operative Care': '#F4D03F'
  };
  return colors[category] || '#11B5A4';
}

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
    <div className="min-h-screen-safe pb-20" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6 safe-area-padding-top safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* App Title */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8" style={{ color: 'var(--primary-600)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Surgical Tech Study
          </h1>
        </div>
        
        {/* Study Progress Card with Exam Countdown */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: 'var(--shadow-raised)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Study Progress
            </h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exam in</span>
              <span 
                className="text-xl font-bold px-3 py-1 rounded-lg" 
                style={{ 
                  color: 'var(--primary-600)', 
                  backgroundColor: 'rgba(17, 181, 164, 0.1)' 
                }}
              >
                {daysUntilExam}
              </span>
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
                  <span className="text-sm font-bold" style={{ color: getCategoryColor(category.name) }}>
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
                      backgroundColor: getCategoryColor(category.name)
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
