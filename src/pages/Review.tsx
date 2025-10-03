import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bookmark, Search, Filter, BookOpen, CheckCircle, ChevronDown, ExternalLink, Headphones } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import { DataProvider, Question } from '../data/providers/DataProvider'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Dropdown from '../components/common/Dropdown'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'
import { getCategoryColor } from '../lib/categoryColors'
import { mockAudioContent } from '../data/audioData'

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

// Removed difficulty filter - not using difficulty levels in current implementation

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
  }, [questions, selectedCategory, selectedFilter, searchTerm])

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
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title="Review Section" />
      <DesktopHeader />

      {/* Filters */}
      <main className="pt-16 md:pt-24 px-4 py-6 max-w-7xl mx-auto safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        <Card className="mb-6 border-2" style={{
          borderColor: 'var(--border-muted)',
          boxShadow: 'var(--shadow-emphasis)'
        }}>
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

            {filteredQuestions.map((question) => {
              // Map category to color
              const getCategoryColor = (category: string) => {
                const lowerCategory = category.toLowerCase()
                if (lowerCategory.includes('pre')) return { bg: 'rgba(106, 169, 255, 0.15)', text: '#6AA9FF' }
                if (lowerCategory.includes('intra') || lowerCategory.includes('surgical')) return { bg: 'rgba(232, 113, 119, 0.15)', text: '#E87177' }
                if (lowerCategory.includes('post')) return { bg: 'rgba(57, 192, 168, 0.15)', text: '#39C0A8' }
                if (lowerCategory.includes('steril')) return { bg: 'rgba(167, 139, 250, 0.15)', text: '#A78BFA' }
                return { bg: 'rgba(17, 181, 164, 0.15)', text: 'var(--primary-500)' }
              }
              
              const categoryColor = getCategoryColor(question.category)
              
              return (
                <div 
                  key={question.id} 
                  className="relative rounded-2xl overflow-hidden mb-4 transition-shadow duration-200 hover:shadow-[var(--shadow-emphasis)]"
                  style={{ 
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-raised)'
                  }}
                >
                  {/* Bookmark Button - Top Right Corner */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleBookmark(question.id)
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 z-10"
                    style={{
                      backgroundColor: bookmarkedQuestions.has(question.id) 
                        ? 'rgba(255, 180, 54, 0.1)' 
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => !bookmarkedQuestions.has(question.id) && (e.currentTarget.style.backgroundColor = 'rgba(255, 180, 54, 0.1)')}
                    onMouseLeave={(e) => !bookmarkedQuestions.has(question.id) && (e.currentTarget.style.backgroundColor = 'transparent')}
                    aria-label={bookmarkedQuestions.has(question.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark 
                      className={`h-5 w-5 transition-colors ${bookmarkedQuestions.has(question.id) ? 'fill-current' : ''}`}
                      style={{ color: bookmarkedQuestions.has(question.id) ? 'var(--bookmark-500)' : 'var(--text-secondary)' }}
                    />
                  </button>

                  {/* Category Pill */}
                  <div className="px-5 pt-4 pb-2">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: categoryColor.bg,
                        color: categoryColor.text
                      }}
                    >
                      {question.category}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="px-5 py-3">
                    <h3 className="text-base font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {question.question}
                    </h3>
                  </div>

                  {/* Correct Answer Only */}
                  <div className="px-5 pb-3">
                    <div 
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: 'var(--correct-answer-bg)',
                        borderLeft: '4px solid var(--success-500)'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle 
                          className="w-5 h-5 flex-shrink-0 mt-0.5" 
                          style={{ color: 'var(--success-700)' }}
                        />
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--success-700)' }}>
                            Correct Answer
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {question.options[question.correct]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Explanation */}
                  <details className="px-5 pb-4">
                    <summary 
                      className="text-sm font-semibold cursor-pointer flex items-center gap-2 py-2 transition-colors"
                      style={{ color: '#38BDF8' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284C7'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#38BDF8'}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform" />
                      Explanation
                    </summary>
                    <div 
                      className="mt-3 p-4 rounded-xl border-l-4 text-sm leading-relaxed"
                      style={{
                        backgroundColor: 'rgba(56, 189, 248, 0.08)',
                        borderColor: 'var(--info-500)',
                        borderLeft: '4px solid var(--info-500)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {question.explanation}
                    </div>
                  </details>

                  {/* Study Links */}
                  <div className="px-5 pb-4 flex gap-3">
                    <button 
                      onClick={() => navigate('/study')}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Study More: {question.category}
                    </button>
                    {(() => {
                      // Find audio files for this category
                      const categoryAudio = mockAudioContent.filter(
                        audio => audio.is_active && audio.category === question.category
                      )
                      
                      if (categoryAudio.length > 0) {
                        // Use the first matching audio for highlight
                        const firstAudio = categoryAudio[0]
                        return (
                          <button 
                            onClick={() => navigate(`/study/audio/${encodeURIComponent(question.category)}?highlight=${firstAudio.id}`)}
                            className="flex items-center gap-2 text-sm font-medium transition-colors"
                            style={{ color: 'var(--primary-600)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--primary-700)'
                              e.currentTarget.style.textDecoration = 'underline'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--primary-600)'
                              e.currentTarget.style.textDecoration = 'none'
                            }}
                          >
                            <Headphones className="w-4 h-4" />
                            🎧 Listen: {question.category}
                          </button>
                        )
                      }
                      
                      return (
                        <button 
                          className="flex items-center gap-2 text-sm transition-colors"
                          style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
                          disabled
                        >
                          <Headphones className="w-4 h-4" />
                          Audio (Coming Soon)
                        </button>
                      )
                    })()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
