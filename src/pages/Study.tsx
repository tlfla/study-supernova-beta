import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, Headphones, Play, Clock, TrendingUp, Award, CheckCircle, FileCheck } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toast from '../components/common/Toast'
import Dropdown from '../components/common/Dropdown'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'
import { getCategoryColor } from '../lib/categoryColors'
import { mockAudioContent, getCategorySummary, formatDuration } from '../data/audioData'

export default function Study() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const studyCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'anatomy', label: 'Anatomy & Physiology' },
    { value: 'procedures', label: 'Surgical Procedures' },
    { value: 'instruments', label: 'Instrumentation' },
    { value: 'sterilization', label: 'Sterilization' },
    { value: 'patient-care', label: 'Patient Care' },
    { value: 'microbiology', label: 'Microbiology' },
    { value: 'pharmacology', label: 'Pharmacology' },
    { value: 'ethics', label: 'Medical Ethics' },
    { value: 'emergency', label: 'Emergency Procedures' }
  ]

  // Get audio category summaries from mock data
  const audioCategories = getCategorySummary(mockAudioContent)

  const flashcardSets = [
    {
      title: 'Medical Terminology',
      count: 300,
      category: 'Anatomy & Physiology',
      description: 'Master essential medical terms with audio pronunciation',
      hasAudio: true,
      route: '/study/flashcards/terminology'
    },
    {
      title: 'Surgical Instruments',
      count: 150,
      category: 'Instrumentation',
      description: 'Visual identification and proper usage',
      hasAudio: false,
      route: '/study/flashcards/instruments'
    },
    {
      title: 'Anatomy & Physiology',
      count: 200,
      category: 'Anatomy & Physiology',
      description: 'Interactive diagrams and body systems',
      hasAudio: false,
      route: '/study/flashcards/anatomy'
    }
  ]

  const studyMaterials = [
    { title: 'Surgical Technique Guides', available: true, category: 'Surgical Procedures' },
    { title: 'Anatomy Reference Sheets', available: true, category: 'Anatomy & Physiology' },
    { title: 'Sterilization Protocols', available: false, category: 'Sterilization' },
    { title: 'Procedure Checklists', available: false, category: 'Patient Care' },
    { title: 'Emergency Response Guide', available: true, category: 'Emergency Procedures' },
    { title: 'Study Planning Templates', available: false, category: 'Medical Ethics' }
  ]

  const handleAudioPlay = (item: string) => {
    setToast({
      type: 'info',
      title: 'Coming Soon',
      message: `${item} audio content will be available in a future update.`
    })
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 pt-16 md:pt-20" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title="Study Area" />
      <DesktopHeader />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Hero Section */}
        <div className="mb-8 px-4 md:px-0">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Study Resources
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Master surgical technology through interactive learning
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-96 px-4 rounded-xl transition-all focus:outline-none"
            style={{
              height: '48px',
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
            {studyCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {/* Audio Learning Section */}
          <div 
            className="rounded-2xl border p-6"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <Headphones className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Audio Learning
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Learn on the go with expert-narrated content
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioCategories.map((categoryData, index) => (
                <button
                  key={categoryData.category}
                  onClick={() => navigate(`/study/audio/${encodeURIComponent(categoryData.category)}`)}
                  className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--stroke-soft)',
                    boxShadow: 'var(--shadow-raised)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-raised)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: getCategoryColor(categoryData.category, 0.1) }}
                      >
                        <Play className="w-4 h-4" style={{ color: getCategoryColor(categoryData.category) }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                          {categoryData.category}
                        </h3>
                        {index === 0 && (
                          <span 
                            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
                            style={{
                              backgroundColor: 'rgba(251, 191, 36, 0.15)',
                              color: '#F59E0B'
                            }}
                          >
                            Most Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
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
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(categoryData.category, 0.15),
                        color: getCategoryColor(categoryData.category)
                      }}
                    >
                      {categoryData.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Flashcards Section */}
          <div 
            className="rounded-2xl border p-6"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Interactive Flashcards
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Memorize and test your knowledge effectively
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flashcardSets.map((set) => (
                <div
                  key={set.title}
                  className="rounded-xl border p-5 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--stroke-soft)',
                    boxShadow: 'var(--shadow-raised)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-raised)'
                  }}
                >
                  <div className="mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: getCategoryColor(set.category, 0.15) }}
                    >
                      <FileText className="w-6 h-6" style={{ color: getCategoryColor(set.category) }} />
                    </div>
                    <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                      {set.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {set.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {set.count}+ terms
                      </span>
                      {set.hasAudio && (
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(17, 181, 164, 0.1)',
                            color: 'var(--primary-600)'
                          }}
                        >
                          <Headphones className="w-3 h-3" />
                          Audio
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate(set.route)}
                      className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                      style={{
                        backgroundColor: 'var(--primary-500)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
                    >
                      Start Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reference Materials Section */}
          <div 
            className="rounded-2xl border p-6"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <FileCheck className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Reference Materials
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Comprehensive guides and study resources
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map((material) => (
                <div
                  key={material.title}
                  className="rounded-xl border p-4 flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: material.available ? 'white' : 'var(--bg-raised)',
                    borderColor: 'var(--stroke-soft)',
                    opacity: material.available ? 1 : 0.6,
                    boxShadow: material.available ? 'var(--shadow-raised)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (material.available) {
                      e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (material.available) {
                      e.currentTarget.style.boxShadow = 'var(--shadow-raised)'
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: material.available 
                          ? getCategoryColor(material.category, 0.15)
                          : 'var(--bg-base)'
                      }}
                    >
                      <FileText 
                        className="w-5 h-5" 
                        style={{ 
                          color: material.available 
                            ? getCategoryColor(material.category)
                            : 'var(--text-secondary)'
                        }} 
                      />
                    </div>
                    <div>
                      <h3 
                        className="font-medium text-sm"
                        style={{ color: material.available ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                      >
                        {material.title}
                      </h3>
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {material.category}
                      </span>
                    </div>
                  </div>

                  {material.available ? (
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#16A34A'
                      }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--bg-raised)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
