import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Search, Filter, BookOpen } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider, Question } from '../data/providers/DataProvider'
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
  { value: 'all', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
]

const filterOptions = [
  { value: 'all', label: 'All Questions' },
  { value: 'bookmarked', label: 'Bookmarked' },
  { value: 'missed', label: 'Previously Missed' },
  { value: 'incorrect', label: 'Incorrect in Recent Quiz' }
]

export default function Review() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { state } = useAppContext()
  const dataProvider = DataProvider.getInstance()

  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Check if we should default to missed-only from Results navigation
  const shouldDefaultToMissed = searchParams.get('missed') === 'true'

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    // Set default filter to missed if coming from Results
    if (shouldDefaultToMissed && selectedFilter === 'all') {
      setSelectedFilter('missed')
    }
  }, [shouldDefaultToMissed, selectedFilter])

  useEffect(() => {
    filterQuestions()
  }, [questions, selectedCategory, selectedDifficulty, selectedFilter, searchTerm])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)

      // Load bookmarked questions
      if (state.currentUser) {
        const bookmarks = await dataProvider.listBookmarks()
        setBookmarkedQuestions(new Set(bookmarks.map(b => b.questionId)))
      }

      // Load all questions
      const allQuestions = await dataProvider.getQuestions()
      setQuestions(allQuestions)
    } catch (error) {
      console.error('Failed to load questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterQuestions = () => {
    let filtered = [...questions]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    }

    // Filter type
    if (selectedFilter === 'bookmarked' && state.currentUser) {
      filtered = filtered.filter(q => bookmarkedQuestions.has(q.id))
    }

    // Missed filter - for now, just show all questions since we don't have response data
    // In a real implementation, this would filter based on incorrect responses
    if (selectedFilter === 'missed') {
      // For demo purposes, just show all questions when missed is selected
      // In production, this would filter to only questions the user got wrong
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    setFilteredQuestions(filtered)
  }

  const handleToggleBookmark = async (questionId: string) => {
    if (!state.currentUser) return

    await dataProvider.toggleBookmark(questionId)

    // Update bookmarked questions set
    const bookmarks = await dataProvider.listBookmarks()
    setBookmarkedQuestions(new Set(bookmarks.map(b => b.questionId)))
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
              <h1 className="text-2xl font-bold text-gray-900">Review & Study</h1>
              <p className="text-gray-600">Review questions and focus on weak areas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter
              </label>
              <Dropdown
                options={filterOptions}
                value={selectedFilter}
                onChange={setSelectedFilter}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Dropdown
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <Dropdown
                options={difficulties}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        {isLoading ? (
          <Card>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">No questions found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFilter('all')
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setSearchTerm('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredQuestions.length} of {questions.length} questions
              </p>
            </div>

            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {question.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {question.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(question.id)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      bookmarkedQuestions.has(question.id)
                        ? 'text-bookmark-500 hover:text-bookmark-600'
                        : 'text-gray-400 hover:text-bookmark-500'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedQuestions.has(question.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
                  {question.question}
                </h3>

                <div className="space-y-2 mb-4">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => (
                    <div
                      key={option}
                      className={`p-3 rounded-lg text-sm ${
                        option === question.correct
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{option}:</span> {question.options[option]}
                      {option === question.correct && (
                        <span className="ml-2">✓ Correct Answer</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </p>
                  {question.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
