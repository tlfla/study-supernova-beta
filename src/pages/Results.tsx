import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Home, Bookmark, CheckCircle, XCircle } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Results() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [results, setResults] = useState<any[]>([])
  const [isBookmarkingAll, setIsBookmarkingAll] = useState(false)
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set())

  // Compute whether all visible questions are bookmarked
  const allBookmarked = results.length > 0 && results.every(result => result.isBookmarked)

  const quizState = state.quizState

  useEffect(() => {
    if (!quizState || !quizState.isComplete) {
      navigate('/quiz-options')
      return
    }

    calculateResults()
  }, [quizState])

  const calculateResults = async () => {
    if (!quizState) return

    const resultsData = await Promise.all(
      quizState.questions.map(async (question, index) => {
        const userAnswer = quizState.answers[question.id]
        const isCorrect = userAnswer === question.correct
        const isBookmarked = state.currentUser
          ? await dataProvider.isBookmarked(state.currentUser.id, question.id)
          : false

        return {
          question,
          userAnswer,
          isCorrect,
          questionNumber: index + 1,
          isBookmarked
        }
      })
    )

    setResults(resultsData)
  }

  const handleRetakeQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' })
    navigate('/quiz-options')
  }

  const handleGoHome = () => {
    dispatch({ type: 'RESET_QUIZ' })
    navigate('/')
  }

  const handleBookmarkAll = async () => {
    if (!state.currentUser || isBookmarkingAll || results.length === 0) return

    setIsBookmarkingAll(true)

    try {
      if (allBookmarked) {
        // Unbookmark all questions
        await Promise.all(
          results.map(result =>
            dataProvider.toggleBookmark(state.currentUser!.id, result.question.id)
          )
        )

        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            type: 'success',
            title: 'Bookmarks Removed',
            message: `All ${results.length} questions have been removed from bookmarks.`
          }
        })
      } else {
        // Bookmark all questions
        const questionsToBookmark = results
          .filter(result => !result.isBookmarked)
          .map(result => result.question.id)

        await Promise.all(
          questionsToBookmark.map(questionId =>
            dataProvider.toggleBookmark(state.currentUser!.id, questionId)
          )
        )

        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            type: 'success',
            title: 'Questions Bookmarked',
            message: `${questionsToBookmark.length} questions have been bookmarked for review.`
          }
        })
      }

      // Refresh results
      await calculateResults()
    } catch (error) {
      console.error('Failed to bookmark questions:', error)
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'error',
          title: 'Bookmark Failed',
          message: 'Failed to bookmark questions. Please try again.'
        }
      })
    } finally {
      setIsBookmarkingAll(false)
    }
  }

  const handleToggleBookmark = async (questionId: string) => {
    if (!state.currentUser) return

    await dataProvider.toggleBookmark(questionId)
    await calculateResults()
  }

  const toggleExplanation = (questionId: string) => {
    const newExpanded = new Set(expandedExplanations)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedExplanations(newExpanded)
  }

  if (!quizState || !quizState.isComplete) {
    return null
  }

  const correctAnswers = results.filter(r => r.isCorrect).length
  const totalQuestions = results.length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const incorrectAnswers = totalQuestions - correctAnswers

  return (
    <div className="min-h-screen-safe bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 safe-area-padding-top">
        <div className="max-w-4xl mx-auto px-4 py-6 safe-area-padding-left safe-area-padding-right">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600">Here's how you performed</p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-4xl mx-auto px-4 py-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Correct</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--success-500)' }}>{correctAnswers}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-gray-900">{incorrectAnswers}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary-500)' }}>{score}%</p>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => navigate('/review?missed=true')}
            variant="outline"
            className="flex-1"
          >
            Review Missed Only
          </Button>
          <Button
            onClick={handleRetakeQuiz}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Quiz (same settings)
          </Button>
          <Button
            onClick={handleBookmarkAll}
            variant={allBookmarked ? "primary" : "outline"}
            className={`flex-1 ${allBookmarked ? 'bg-[var(--bookmark-500)] hover:bg-[var(--bookmark-600)]' : ''}`}
            isLoading={isBookmarkingAll}
            aria-pressed={allBookmarked}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            {allBookmarked ? 'Bookmarked All' : 'Bookmark All Questions'}
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Questions Review */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Question Review
          </h2>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.question.id}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {result.questionNumber}
                    </span>
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                      style={result.isCorrect 
                        ? { borderColor: 'var(--success-500)', color: 'var(--success-500)', backgroundColor: '#F0FFF4' }
                        : { borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#FFE9E9', color: '#666' }
                      }
                    >
                      {result.isCorrect ? 'Correct' : 'Review'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(result.question.id)}
                    className="p-2 rounded-lg border transition-colors duration-200"
                    style={result.isBookmarked 
                      ? { backgroundColor: 'var(--bookmark-500)', borderColor: 'var(--bookmark-600)', color: 'black' }
                      : { borderColor: 'rgba(0,0,0,0.2)', color: 'rgba(0,0,0,0.6)' }
                    }
                  >
                    <Bookmark className={`h-4 w-4 ${result.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-900 mb-3 leading-relaxed">
                  {result.question.question}
                </p>

                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => {
                    const isUserAnswer = result.userAnswer === option
                    const isCorrectAnswer = result.question.correct === option

                    return (
                      <div
                        key={option}
                        className="rounded-xl px-3 py-2 text-sm border text-gray-900"
                        style={{
                          ...(isCorrectAnswer ? { borderColor: 'var(--success-500)' } : { borderColor: 'rgba(0,0,0,0.1)' }),
                          ...(isUserAnswer && !isCorrectAnswer ? { backgroundColor: '#FFE9E9' } : { backgroundColor: 'white' })
                        }}
                      >
                        <span className="font-medium">{option}:</span> {result.question.options[option]}
                        {isCorrectAnswer && (
                          <span className="ml-2" style={{ color: 'var(--success-500)' }}>✓</span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="ml-2 text-gray-600">← Your Answer</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => toggleExplanation(result.question.id)}
                    className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="font-medium">Explanation</span>
                    <span className={`transform transition-transform ${expandedExplanations.has(result.question.id) ? 'rotate-180' : ''}`}>
                      ▶
                    </span>
                  </button>
                  {expandedExplanations.has(result.question.id) && (
                    <div className="mt-2 rounded-lg border border-black/10 px-3 py-2" style={{ backgroundColor: '#F0F6FF' }}>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
