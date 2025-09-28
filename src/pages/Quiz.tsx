import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bookmark, Clock, Flag } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Button from '../components/common/Button'

export default function Quiz() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const quizState = state.quizState
  const currentQuestion = quizState?.questions[quizState.currentQuestionIndex]
  const currentAnswer = quizState?.answers[currentQuestion?.id || '']

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
    setShowFeedback(true)

    // Save the answer
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId: currentQuestion.id, answer }
    })

    // Record the response
    if (state.currentUser) {
      dataProvider.saveUserResponse({
        user_id: state.currentUser.id,
        question_id: currentQuestion.id,
        answer,
        is_correct: answer === currentQuestion.correct,
        time_spent: timeElapsed
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

    const newBookmarkState = await dataProvider.toggleBookmark(
      state.currentUser.id,
      currentQuestion.id
    )
    setIsBookmarked(newBookmarkState)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/quiz-options')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Options
              </Button>
              <div>
                <p className="text-sm text-gray-600">
                  Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              {quizState.timeRemaining && (
                <div className="flex items-center space-x-2 text-sm">
                  <Flag className="h-4 w-4 text-orange-500" />
                  <span className="font-mono text-orange-600">
                    {formatTimeRemaining(quizState.timeRemaining)}
                  </span>
                </div>
              )}
              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isBookmarked
                    ? 'bg-bookmark-active text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {currentQuestion.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {currentQuestion.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {(['A', 'B', 'C', 'D'] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? option === currentQuestion.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-primary-500 bg-primary-50 text-primary-800'
                    : showFeedback && option === currentQuestion.correct
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium mt-0.5">
                    {option}
                  </span>
                  <span className="text-base">{currentQuestion.options[option]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedAnswer === currentQuestion.correct
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {selectedAnswer === currentQuestion.correct ? '✓' : '✗'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {currentQuestion.rationale}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={quizState.currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {showFeedback ? (
                <Button onClick={handleNext}>
                  {quizState.currentQuestionIndex === quizState.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowFeedback(true)}
                  disabled={!selectedAnswer}
                >
                  Check Answer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
