import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
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
            <div className="text-right">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <ProgressRing progress={readinessScore} size={60} />
                  <div>
                    <p className="text-xs text-gray-500">{daysUntilExam} days to exam</p>
                    <p className="text-sm font-medium text-gray-900">{readinessScore}% ready</p>
                  </div>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (daysUntilExam / 30) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Days to Exam + Circle */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Exam Progress</h2>
              <Calendar className="h-6 w-6 text-primary-500" />
            </div>
            <div className="space-y-4">
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
        </div>

        {/* Hero Actions - Exactly 3 centered and tall */}
        <div className="flex justify-center gap-6 mb-12">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border min-h-[120px] w-80 flex flex-col justify-center"
            onClick={handleStartQuiz}
          >
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Start New Quiz</h3>
              <p className="text-sm text-gray-600">Begin your practice session</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border min-h-[120px] w-80 flex flex-col justify-center hover:bg-primary-50/70"
            onClick={handleReviewMissed}
          >
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Review Missed Questions</h3>
              <p className="text-sm text-gray-600">Focus on areas that need work</p>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border min-h-[120px] w-80 flex flex-col justify-center hover:bg-primary-50/70"
            onClick={handleStudyResources}
          >
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Study Resources</h3>
              <p className="text-sm text-gray-600">Access study materials and guides</p>
            </div>
          </Card>
        </div>

        {/* Category Performance */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border mb-8">
          <button
            onClick={() => setCategoryPerformanceExpanded(!categoryPerformanceExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900">Category Performance</h2>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                {categoryPerformanceExpanded ? 'Collapse' : 'Expand'}
              </div>
              {categoryPerformanceExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>

          {categoryPerformanceExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Anatomy & Physiology', 'Surgical Procedures', 'Instrumentation'].map((category) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-medium text-gray-900">{category}</h3>
                    <div className="space-y-2">
                      {/* Mock line graph placeholder */}
                      <div className="h-16 bg-gray-100 rounded-lg flex items-end justify-between p-2">
                        <div className="w-2 h-8 bg-primary-300 rounded-t"></div>
                        <div className="w-2 h-12 bg-primary-400 rounded-t"></div>
                        <div className="w-2 h-6 bg-primary-500 rounded-t"></div>
                        <div className="w-2 h-10 bg-primary-600 rounded-t"></div>
                        <div className="w-2 h-14 bg-primary-700 rounded-t"></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Practice this week: 12</span>
                        <span>Best score: 85%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {state.userProgress.reduce((sum, p) => sum + p.questions_attempted, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Questions Attempted</p>
            </div>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {state.userProgress.reduce((sum, p) => sum + p.questions_correct, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {state.userProgress.length > 0
                  ? Math.round(state.userProgress.reduce((sum, p) => sum + p.best_score, 0) / state.userProgress.length)
                  : 0
                }%
              </p>
              <p className="text-sm text-gray-600 mt-1">Average Score</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
