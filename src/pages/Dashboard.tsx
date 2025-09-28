import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, RotateCcw, Calendar, Target, TrendingUp } from 'lucide-react'
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

  const handleContinueStudying = () => {
    navigate('/quiz-options')
  }

  const handleReviewMissed = () => {
    navigate('/review')
  }

  const daysUntilExam = 30 // Mock data
  const readinessScore = 75 // Mock data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {state.currentUser?.name || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to continue your surgical tech journey?
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Days until exam</p>
              <p className="text-3xl font-bold text-primary-600">{daysUntilExam}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Readiness Score */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Readiness Score</h2>
              <TrendingUp className="h-6 w-6 text-primary-500" />
            </div>
            <div className="flex items-center justify-center">
              <ProgressRing progress={readinessScore} size={120} />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Based on your recent performance
            </p>
          </Card>

          {/* Daily Goal */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daily Goal</h2>
              <Target className="h-6 w-6 text-primary-500" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium">
                    {state.dailyGoal?.completed_questions || 0} / {state.dailyGoal?.target_questions || 20}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((state.dailyGoal?.completed_questions || 0) / (state.dailyGoal?.target_questions || 20)) * 100)}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">
                    {Math.round((state.dailyGoal?.completed_time || 0) / 60)} / {state.dailyGoal?.target_time || 30} min
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((state.dailyGoal?.completed_time || 0) / 60 / (state.dailyGoal?.target_time || 30)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {savedQuizData && (
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
              onClick={handleResumeQuiz}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Resume Quiz</h3>
                  <p className="text-sm text-gray-600">Continue where you left off</p>
                </div>
              </div>
            </Card>
          )}

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
            onClick={handleStartQuiz}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Play className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quiz of the Day</h3>
                <p className="text-sm text-gray-600">Start your daily practice</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
            onClick={handleContinueStudying}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Continue Studying</h3>
                <p className="text-sm text-gray-600">Pick up where you left off</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
            onClick={handleReviewMissed}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <RotateCcw className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Missed</h3>
                <p className="text-sm text-gray-600">Focus on weak areas</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 opacity-50 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Study Schedule</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </Card>
        </div>

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
