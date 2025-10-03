import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, FileText, Download, Volume2, Play } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toast from '../components/common/Toast'
import Dropdown from '../components/common/Dropdown'
import MinimalHeader from '../components/common/MinimalHeader'
import DesktopHeader from '../components/common/DesktopHeader'

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

  const studySections = [
    {
      title: 'Audio Resources',
      category: 'all',
      description: 'Listen to surgical procedures and terminology explanations',
      icon: Volume2,
      items: [
        'Surgical Procedure Audio Guides',
        'Medical Terminology Pronunciation',
        'Case Study Discussions',
        'Expert Interviews'
      ]
    },
    {
      title: 'Terminology & Flashcards',
      category: 'all',
      description: 'Interactive flashcards and terminology drills',
      icon: FileText,
      items: [
        'Medical Terminology Basics',
        'Surgical Instrument Names',
        'Anatomical Terms',
        'Procedure-Specific Vocabulary'
      ]
    },
    {
      title: 'Study Guides',
      category: 'all',
      description: 'Comprehensive study materials and reference documents',
      icon: Download,
      items: [
        'Surgical Technique Guides',
        'Anatomy Reference Sheets',
        'Procedure Checklists',
        'Study Planning Templates'
      ]
    }
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
        {/* Subtitle card */}
        <div 
          className="mb-6 p-4 rounded-xl border"
          style={{
            backgroundColor: 'rgba(17, 181, 164, 0.05)',
            borderColor: 'rgba(17, 181, 164, 0.2)'
          }}
        >
          <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            Deep dive into surgical technology concepts
          </p>
        </div>
        
        {/* Category Filter */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filter by Category</h2>
            <Dropdown
              options={studyCategories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select category"
            />
          </div>
        </Card>

        <div className="space-y-8">
          {studySections
            .filter(section => selectedCategory === 'all' || section.category === selectedCategory)
            .map((section) => (
            <Card
              key={section.title}
              className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <section.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <Card
                    key={item}
                    className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border hover:shadow-xl transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item}</h3>
                        <p className="text-sm text-gray-600">
                          {section.title === 'Audio Resources' ? 'Click to play audio guide' : 'Click to open study materials'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {section.title === 'Audio Resources' && (
                          <button
                            onClick={() => handleAudioPlay(item)}
                            className="p-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
                            aria-label={`Play ${item}`}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <div className="text-gray-400">
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-12 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border-border text-center">
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Study Materials Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on comprehensive study materials including audio guides,
              interactive flashcards, and downloadable reference sheets. Stay tuned for updates!
            </p>
          </div>
        </Card>
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
