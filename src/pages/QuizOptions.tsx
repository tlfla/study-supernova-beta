import { useState } from 'react'
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

const difficulties = [
  { value: 'mixed', label: 'Mixed Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
]

const questionCounts = [
  { value: '10', label: '10 Questions' },
  { value: '20', label: '20 Questions' },
  { value: '30', label: '30 Questions' },
  { value: '50', label: '50 Questions' }
]

const timeLimits = [
  { value: 'none', label: 'No Time Limit' },
  { value: '15', label: '15 Minutes' },
  { value: '30', label: '30 Minutes' },
  { value: '45', label: '45 Minutes' },
  { value: '60', label: '60 Minutes' }
]

export default function QuizOptions() {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed')
  const [selectedQuestionCount, setSelectedQuestionCount] = useState('20')
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('none')
  const [isLoading, setIsLoading] = useState(false)

  const handleStartQuiz = async () => {
    setIsLoading(true)

    try {
      const filters: any = {}
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory
      }
      if (selectedDifficulty !== 'mixed') {
        filters.difficulty = selectedDifficulty
      }
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

      dispatch({
        type: 'SET_QUIZ_SETTINGS',
        payload: {
          category: selectedCategory,
          difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard' | 'mixed',
          questionCount: parseInt(selectedQuestionCount),
          timeLimit: selectedTimeLimit !== 'none' ? parseInt(selectedTimeLimit) : undefined
        }
      })

      dispatch({
        type: 'START_QUIZ',
        payload: {
          questions,
          settings: {
            category: selectedCategory,
            difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard' | 'mixed',
            questionCount: parseInt(selectedQuestionCount),
            timeLimit: selectedTimeLimit !== 'none' ? parseInt(selectedTimeLimit) : undefined
          }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Configuration</h2>

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Dropdown
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Select a category"
              />
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <Dropdown
                options={difficulties}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                placeholder="Select difficulty"
              />
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
                Leave as "No Time Limit" for untimed practice
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
