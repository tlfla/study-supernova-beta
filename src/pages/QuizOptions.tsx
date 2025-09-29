import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Dropdown from '../components/common/Dropdown'

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Anatomy & Physiology', label: 'Anatomy & Physiology' },
  { value: 'Surgical Procedures', label: 'Surgical Procedures' },
  { value: 'Instrumentation', label: 'Instrumentation' },
  { value: 'Sterilization', label: 'Sterilization' },
  { value: 'Patient Care', label: 'Patient Care' },
  { value: 'Microbiology', label: 'Microbiology' },
  { value: 'Pharmacology', label: 'Pharmacology' },
  { value: 'Medical Ethics', label: 'Medical Ethics' },
  { value: 'Emergency Procedures', label: 'Emergency Procedures' },
  { value: 'Post-Operative Care', label: 'Post-Operative Care' }
]


const timeLimits = [
  { value: 'none', label: 'No Time Limit' },
  { value: '15', label: '15 Minutes' },
  { value: '30', label: '30 Minutes' },
  { value: '45', label: '45 Minutes' },
  { value: '60', label: '60 Minutes' }
]

const quizModes = [
  { value: 'practice', label: 'Practice Mode' },
  { value: 'exam', label: 'Exam Mode' }
]

const questionCounts = [
  { value: '10', label: '10 Questions' },
  { value: '20', label: '20 Questions' },
  { value: '30', label: '30 Questions' },
  { value: '50', label: '50 Questions' },
  { value: '100', label: '100 Questions' }
]

export default function QuizOptions() {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [selectedQuestionCount, setSelectedQuestionCount] = useState('20')
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('none')
  const [selectedMode, setSelectedMode] = useState('practice')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Set default time limit based on mode
    if (selectedMode === 'exam' && selectedTimeLimit === 'none') {
      setSelectedTimeLimit('30') // Default 30 minutes for exam mode
    } else if (selectedMode === 'practice' && selectedTimeLimit === '30') {
      setSelectedTimeLimit('none') // Default no time limit for practice mode
    }
  }, [selectedMode, selectedTimeLimit])

  const handleStartQuiz = async () => {
    setIsLoading(true)

    try {
      const filters: any = {}
      filters.limit = parseInt(selectedQuestionCount)

      const questions = await dataProvider.getQuestions(filters)

      if (questions.length === 0) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            type: 'warning',
            title: 'No Questions Found',
            message: 'Please adjust your filters and try again.'
          }
        })
        return
      }

      const quizSettings = {
        questionCount: parseInt(selectedQuestionCount),
        timeLimit: selectedTimeLimit !== 'none' ? parseInt(selectedTimeLimit) : undefined,
        mode: selectedMode as 'practice' | 'exam'
      }

      dispatch({
        type: 'SET_QUIZ_SETTINGS',
        payload: quizSettings
      })

      dispatch({
        type: 'START_QUIZ',
        payload: {
          questions,
          settings: quizSettings
        }
      })

      navigate('/quiz')
    } catch (error) {
      console.error('Failed to start quiz:', error)
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'error',
          title: 'Failed to Start Quiz',
          message: 'Please try again.'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen-safe bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 safe-area-padding-top">
        <div className="max-w-7xl mx-auto px-4 py-4 safe-area-padding-left safe-area-padding-right">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Options</h1>
              <p className="text-gray-600">Customize your practice session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Configuration</h2>

          <div className="space-y-6">
            {/* Quiz Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Mode
              </label>
              <Dropdown
                options={quizModes}
                value={selectedMode}
                onChange={setSelectedMode}
                placeholder="Select quiz mode"
              />
              <p className="text-xs text-gray-500 mt-1">
                Practice: Shows rationales after answer submission; optional timer.
                Exam: No rationales until results; timer on by default.
              </p>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <Dropdown
                options={questionCounts}
                value={selectedQuestionCount}
                onChange={setSelectedQuestionCount}
                placeholder="Select question count"
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (Optional)
              </label>
              <Dropdown
                options={timeLimits}
                value={selectedTimeLimit}
                onChange={setSelectedTimeLimit}
                placeholder="Select time limit"
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedMode === 'exam' ? 'Timer on by default for exam mode' : 'Leave as "No Time Limit" for untimed practice'}
              </p>
            </div>
          </div>
        </Card>

        {/* Start Quiz Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartQuiz}
            isLoading={isLoading}
            size="lg"
            className="px-8"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
