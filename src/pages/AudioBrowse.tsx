import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Search, Play, Clock } from 'lucide-react'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'
import { getCategoryColor } from '../lib/categoryColors'
import { mockAudioContent, getCategorySummary, formatDuration } from '../data/audioData'

export default function AudioBrowse() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Get all categories with actual file counts
  const allCategories = getCategorySummary(mockAudioContent)

  // Filter categories based on search
  const filteredCategories = allCategories.filter(cat => {
    if (!searchTerm.trim()) return true
    return cat.category.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title="Audio Learning" />
      <DesktopHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-28 pb-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/study')}
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
            <span className="font-medium">Back to Study</span>
          </button>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Audio Learning
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Browse by category
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
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
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((categoryData) => (
            <button
              key={categoryData.category}
              onClick={() => {
                if (categoryData.hasFiles) {
                  navigate(`/study/audio/${encodeURIComponent(categoryData.category)}`)
                }
              }}
              disabled={!categoryData.hasFiles}
              className="rounded-xl border p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--stroke-soft)',
                boxShadow: 'var(--shadow-raised)',
                transform: categoryData.hasFiles ? 'translateY(0)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (categoryData.hasFiles) {
                  e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (categoryData.hasFiles) {
                  e.currentTarget.style.boxShadow = 'var(--shadow-raised)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{ 
                      width: '40px',
                      height: '40px',
                      backgroundColor: getCategoryColor(categoryData.category, 0.15)
                    }}
                  >
                    <Play className="w-4 h-4" style={{ color: getCategoryColor(categoryData.category) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>
                      {categoryData.category}
                    </h3>
                  </div>
                </div>
                
                <span 
                  className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ml-2"
                  style={{
                    backgroundColor: getCategoryColor(categoryData.category, 0.15),
                    color: getCategoryColor(categoryData.category)
                  }}
                >
                  {categoryData.category.split(' ')[0]}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                {categoryData.hasFiles ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {formatDuration(categoryData.totalDuration)}
                        </span>
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {categoryData.fileCount} {categoryData.fileCount === 1 ? 'episode' : 'episodes'}
                      </span>
                    </div>
                  </>
                ) : (
                  <span 
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(100, 116, 139, 0.1)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              No categories found
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

