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
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Days until exam</span>
                <span className="font-medium text-primary-600">{daysUntilExam}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (daysUntilExam / 30) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center justify-center">
              <ProgressRing progress={readinessScore} size={120} />
            </div>
            <p className="text-center text-sm text-gray-600">
              {readinessScore}% study completion
            </p>
          </div>
        </Card>

        {/* Quick Actions - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <Card
            className="cursor-pointer transition-all duration-200 border border-black/10 rounded-xl shadow-sm min-h-[110px] flex flex-col justify-center hover:ring-2 hover:ring-[var(--primary-500)]/20"
            onClick={handleStartQuiz}
          >
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--primary-500)' }}>
                <Play className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">Start Quiz</h3>
              <p className="text-xs text-gray-600">Practice session</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 border border-black/10 rounded-xl shadow-sm min-h-[110px] flex flex-col justify-center hover:ring-2 hover:ring-[var(--primary-500)]/20"
            onClick={handleReviewMissed}
          >
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="h-5 w-5" style={{ color: 'var(--primary-500)' }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">Review Missed</h3>
              <p className="text-xs text-gray-600">Focus on weak areas</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 border border-black/10 rounded-xl shadow-sm min-h-[110px] flex flex-col justify-center hover:ring-2 hover:ring-[var(--primary-500)]/20"
            onClick={handleStudyResources}
          >
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-5 w-5" style={{ color: 'var(--primary-500)' }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">Study Resources</h3>
              <p className="text-xs text-gray-600">Materials & guides</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 border border-black/10 rounded-xl shadow-sm min-h-[110px] flex flex-col justify-center hover:ring-2 hover:ring-[var(--primary-500)]/20"
            onClick={() => navigate('/profile#performance')}
          >
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5" style={{ color: 'var(--primary-500)' }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">Performance</h3>
              <p className="text-xs text-gray-600">Track progress</p>
            </div>
          </Card>
        </div>

        {/* Category Performance Snippet */}
        <Card className="border border-black/10 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
            <button 
              onClick={() => navigate('/profile#performance')}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--primary-500)' }}
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
              <div key={category.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-medium text-gray-900">{category.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${category.score}%`,
                      backgroundColor: 'var(--primary-500)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
