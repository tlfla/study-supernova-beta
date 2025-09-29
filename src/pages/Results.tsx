import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Home, Bookmark, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react'
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
        {/* Horizontal Score Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--success-500)' }}>
              {correctAnswers}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Correct
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--danger-500)' }}>
              {incorrectAnswers}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Incorrect
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-600)' }}>
              {score}%
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Score
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button 
            onClick={handleRetakeQuiz}
            className="w-full py-3.5 rounded-xl text-white font-semibold shadow-md transition-all"
            style={{ backgroundColor: 'var(--primary-500)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
          >
            <RefreshCw className="inline w-5 h-5 mr-2" />
            Retry Quiz (same settings)
          </button>
          
          <button 
            onClick={handleBookmarkAll}
            disabled={isBookmarkingAll}
            className="w-full py-3.5 rounded-xl bg-white font-semibold border-2 shadow-sm transition-all disabled:opacity-50"
            style={{ 
              color: 'var(--bookmark-600)', 
              borderColor: 'var(--bookmark-500)' 
            }}
            onMouseEnter={(e) => !isBookmarkingAll && (e.currentTarget.style.backgroundColor = 'rgba(255, 180, 54, 0.05)')}
            onMouseLeave={(e) => !isBookmarkingAll && (e.currentTarget.style.backgroundColor = 'white')}
          >
            <Bookmark className="inline w-5 h-5 mr-2" />
            {isBookmarkingAll ? 'Bookmarking...' : (allBookmarked ? 'Bookmarked All' : 'Bookmark All Questions')}
          </button>
          
          <button 
            onClick={() => navigate('/review?missed=true')}
            className="w-full py-3.5 rounded-xl bg-white font-semibold border-2 shadow-sm transition-all"
            style={{ 
              color: 'var(--primary-600)', 
              borderColor: 'var(--primary-400)' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <ArrowRight className="inline w-5 h-5 mr-2" />
            Review Missed Only
          </button>
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
                        ? { borderColor: 'var(--success-500)', color: 'var(--success-500)', backgroundColor: 'var(--correct-answer-bg)' }
                        : { borderColor: 'var(--border-muted)', backgroundColor: 'var(--wrong-answer-bg)', color: 'var(--text-secondary)' }
                      }
                    >
                      {result.isCorrect ? 'Correct' : 'Review'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(result.question.id)}
                    className="p-2 rounded-lg border transition-colors duration-200"
                    style={result.isBookmarked 
                      ? { backgroundColor: 'var(--bookmark-500)', borderColor: 'var(--bookmark-600)', color: 'var(--text-primary)' }
                      : { borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }
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
                    const isWrong = isUserAnswer && !isCorrectAnswer

                    // User's wrong answer
                    if (isWrong) {
                      return (
                        <div
                          key={option}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: 'var(--wrong-answer-bg)',
                            borderLeft: '4px solid var(--danger-500)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5" style={{ color: 'var(--danger-700)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {option}. {result.question.options[option]}
                            </span>
                            <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--danger-700)' }}>
                              Your Answer
                            </span>
                          </div>
                        </div>
                      )
                    }

                    // Correct answer
                    if (isCorrectAnswer) {
                      return (
                        <div
                          key={option}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: 'var(--correct-answer-bg)',
                            borderLeft: '4px solid var(--success-500)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" style={{ color: 'var(--success-700)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {option}. {result.question.options[option]}
                            </span>
                            <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--success-700)' }}>
                              Correct
                            </span>
                          </div>
                        </div>
                      )
                    }

                    // Other options (neutral)
                    return (
                      <div
                        key={option}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-raised)' }}
                      >
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {option}. {result.question.options[option]}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Explanation:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {result.question.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
