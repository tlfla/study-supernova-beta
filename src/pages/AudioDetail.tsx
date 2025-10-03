import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Home, Search, Play, Pause, ChevronDown, MoreVertical, SkipBack, SkipForward } from 'lucide-react'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'
import { getCategoryColor } from '../lib/categoryColors'
import { mockAudioContent, formatDuration, AudioContent } from '../data/audioData'

export default function AudioDetail() {
  const navigate = useNavigate()
  const { category } = useParams<{ category: string }>()
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('highlight')

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'qa' | 'study_guide'>('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [currentAudio, setCurrentAudio] = useState<AudioContent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const decodedCategory = decodeURIComponent(category || '')

  // Filter audio files for this category
  const audioFiles = mockAudioContent
    .filter(audio => audio.is_active && audio.category === decodedCategory)
    .filter(audio => {
      // Type filter
      if (typeFilter !== 'all' && audio.type !== typeFilter) return false
      
      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        return (
          audio.title.toLowerCase().includes(term) ||
          audio.description.toLowerCase().includes(term) ||
          audio.keywords.some(k => k.toLowerCase().includes(term))
        )
      }
      
      return true
    })

  // Handle highlight effect
  useEffect(() => {
    if (highlightId) {
      // Auto-expand the highlighted card
      setExpandedCards(prev => new Set(prev).add(highlightId))
      
      // Scroll to the card after a brief delay
      setTimeout(() => {
        const element = document.getElementById(`audio-card-${highlightId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Add pulse animation
          element.classList.add('highlight-pulse')
          setTimeout(() => element.classList.remove('highlight-pulse'), 2000)
        }
      }, 300)
    }
  }, [highlightId])

  const toggleExpand = (audioId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(audioId)) {
        newSet.delete(audioId)
      } else {
        newSet.add(audioId)
      }
      return newSet
    })
  }

  const handlePlayAudio = (audio: AudioContent) => {
    if (currentAudio?.id === audio.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentAudio(audio)
      setIsPlaying(true)
    }
  }

  const handleClosePlayer = () => {
    setCurrentAudio(null)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title={`${decodedCategory} Audio`} />
      <DesktopHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-28 pb-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/study/audio')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors mb-4"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Audio Library</span>
          </button>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {decodedCategory}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            {audioFiles.length} audio {audioFiles.length === 1 ? 'file' : 'files'} available
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 sticky top-16 md:top-20 z-10 bg-[var(--bg-base)] py-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audio files..."
              className="w-full pl-10 pr-4 py-3 rounded-xl transition-all focus:outline-none"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'var(--border-muted)',
                backgroundColor: 'white',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-500)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(17, 181, 164, 0.2)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-muted)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'qa' | 'study_guide')}
            className="px-4 py-3 rounded-xl transition-all focus:outline-none md:w-48"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--border-muted)',
              backgroundColor: 'white',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-500)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(17, 181, 164, 0.2)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-muted)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <option value="all">All Types</option>
            <option value="qa">Q&A Only</option>
            <option value="study_guide">Study Guide Only</option>
          </select>
        </div>

        {/* Audio File Cards */}
        <div className="space-y-4">
          {audioFiles.length === 0 ? (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--stroke-soft)'
              }}
            >
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                No audio files found
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            audioFiles.map((audio) => {
              const isExpanded = expandedCards.has(audio.id)
              const isCurrentlyPlaying = currentAudio?.id === audio.id && isPlaying

              return (
                <div
                  key={audio.id}
                  id={`audio-card-${audio.id}`}
                  className="rounded-2xl border-2 p-5 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: audio.id === highlightId ? 'var(--primary-500)' : 'var(--border-muted)',
                    boxShadow: 'var(--shadow-raised)'
                  }}
                >
                  {/* Header Row */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayAudio(audio)}
                      className="flex-shrink-0 rounded-full transition-all"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: isCurrentlyPlaying ? 'var(--primary-600)' : 'var(--primary-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isCurrentlyPlaying ? 'var(--primary-600)' : 'var(--primary-500)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      aria-label={isCurrentlyPlaying ? 'Pause audio' : 'Play audio'}
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>

                    {/* Title and Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {audio.title}
                      </h3>
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {audio.description}
                      </p>

                      {/* Category and Type Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(audio.category, 0.15),
                            color: getCategoryColor(audio.category)
                          }}
                        >
                          {audio.category}
                        </span>
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: audio.type === 'qa' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                            color: audio.type === 'qa' ? '#3B82F6' : '#F59E0B'
                          }}
                        >
                          {audio.type === 'qa' ? 'Q&A' : 'Study Guide'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Icon */}
                    <button
                      className="flex-shrink-0 p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Duration: {formatDuration(audio.duration_seconds)}
                    </span>
                  </div>

                  {/* Expandable Section */}
                  <button
                    onClick={() => toggleExpand(audio.id)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isExpanded ? 'var(--bg-raised)' : 'transparent',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <span className="text-sm font-semibold">
                      {isExpanded ? 'Hide' : 'Show'} Topics & Keywords
                    </span>
                    <ChevronDown
                      className="w-5 h-5 transition-transform duration-200"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      className="mt-3 p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--bg-raised)',
                        borderColor: 'var(--stroke-soft)'
                      }}
                    >
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Topics Covered:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {audio.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{
                              backgroundColor: 'rgba(100, 116, 139, 0.1)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Persistent Audio Player */}
      {currentAudio && (
        <div
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderTop: '1px solid var(--stroke-soft)',
            boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.08)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 safe-area-padding-bottom safe-area-padding-left safe-area-padding-right">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-shrink-0 rounded-full transition-all"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--primary-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                )}
              </button>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {currentAudio.title}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {currentAudio.category}
                </p>
              </div>

              {/* Skip Controls */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  aria-label="Skip back 15 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  aria-label="Skip forward 15 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClosePlayer}
                className="flex-shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Close
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--bg-raised)' }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: '30%', // Mock progress
                    backgroundColor: 'var(--primary-500)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes highlight-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(17, 181, 164, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(17, 181, 164, 0); }
        }
        .highlight-pulse {
          animation: highlight-pulse 2s ease-out;
        }
      `}</style>
    </div>
  )
}

