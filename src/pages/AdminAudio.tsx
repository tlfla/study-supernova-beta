import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Upload, FileJson, Search, CheckCircle, AlertCircle } from 'lucide-react'
import DesktopHeader from '../components/common/DesktopHeader'
import MinimalHeader from '../components/common/MinimalHeader'
import { useAppContext } from '../state/AppContext'

// TODO: Add Supabase auth check for admin role

interface AudioMetadata {
  title: string
  description: string
  type: 'qa' | 'study_guide'
  category: string
  keywords: string[]
  duration_seconds: number
  questions: string[]
}

interface QuestionMatch {
  snippet: string
  matchedQuestion?: {
    id: string
    question: string
    category: string
  }
  selectedQuestionId?: string
  status: 'exact' | 'multiple' | 'none'
}

export default function AdminAudio() {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()
  
  const [step, setStep] = useState(1)
  const [cdnUrl, setCdnUrl] = useState('')
  const [metadataJson, setMetadataJson] = useState('')
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null)
  const [questionMatches, setQuestionMatches] = useState<QuestionMatch[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOpenUploader = () => {
    window.open('https://5dbe46df.webapp-a2t.pages.dev/', '_blank')
  }

  const handleContinueToStep2 = () => {
    if (!cdnUrl.trim()) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'warning',
          title: 'CDN URL Required',
          message: 'Please paste the CDN URL from Cloudflare'
        }
      })
      return
    }
    setStep(2)
  }

  const handlePreviewAndMatch = async () => {
    try {
      const metadata: AudioMetadata = JSON.parse(metadataJson)
      setAudioMetadata(metadata)
      setIsProcessing(true)

      // TODO: Implement fuzzy search against questions table using Supabase
      // For now, simulate matches
      const matches: QuestionMatch[] = metadata.questions.map((snippet) => ({
        snippet,
        status: 'none' as const // Will be determined by actual search
      }))

      setQuestionMatches(matches)
      setStep(3)
      setIsProcessing(false)
    } catch (error) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'error',
          title: 'Invalid JSON',
          message: 'Please check your JSON format and try again'
        }
      })
    }
  }

  const handleSaveAndLink = async () => {
    setIsProcessing(true)

    try {
      // TODO: Implement Supabase operations:
      // 1. Create record in audio_content table
      // 2. Create links in audio_question_links table
      // 3. Set relevance_score: 10 for 'qa', 5 for 'study_guide'

      const linkedCount = questionMatches.filter(m => m.selectedQuestionId).length

      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'success',
          title: 'Audio Content Saved',
          message: `Successfully linked ${linkedCount} questions`
        }
      })

      setStep(4)
    } catch (error) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          type: 'error',
          title: 'Save Failed',
          message: 'Failed to save audio content. Please try again.'
        }
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setCdnUrl('')
    setMetadataJson('')
    setAudioMetadata(null)
    setQuestionMatches([])
  }

  return (
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title="Manage Audio" />
      <DesktopHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-28 pb-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
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
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Admin</span>
          </button>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: step >= s ? 'var(--primary-500)' : 'var(--bg-raised)',
                  color: step >= s ? 'white' : 'var(--text-secondary)'
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Audio */}
        {step === 1 && (
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <Upload className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Step 1: Upload Audio
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Upload your audio file to Cloudflare and paste the CDN URL
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleOpenUploader}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  backgroundColor: 'white',
                  border: '2px solid var(--primary-500)',
                  color: 'var(--primary-600)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.05)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <ExternalLink className="w-5 h-5" />
                Open Cloudflare Uploader
              </button>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  CDN URL
                </label>
                <input
                  type="text"
                  value={cdnUrl}
                  onChange={(e) => setCdnUrl(e.target.value)}
                  placeholder="https://cdn.example.com/audio/file.mp3"
                  className="w-full px-4 py-3 rounded-xl transition-all focus:outline-none"
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

              <button
                onClick={handleContinueToStep2}
                disabled={!cdnUrl.trim()}
                className="w-full px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--primary-500)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (cdnUrl.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                }}
              >
                Continue to Step 2
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Import Audio Metadata */}
        {step === 2 && (
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <FileJson className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Step 2: Import Audio Metadata
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Paste the JSON metadata from your external Claude chat
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Audio Metadata JSON
                </label>
                <textarea
                  value={metadataJson}
                  onChange={(e) => setMetadataJson(e.target.value)}
                  placeholder={`{
  "title": "Surgical Procedures Q&A Session 1",
  "description": "Common questions about surgical procedures",
  "type": "qa",
  "category": "Surgical Procedures",
  "keywords": ["surgery", "procedures", "techniques"],
  "duration_seconds": 1800,
  "questions": [
    "What is the primary purpose of...",
    "How do you prepare for..."
  ]
}`}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl font-mono text-sm transition-all focus:outline-none"
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

              <button
                onClick={handlePreviewAndMatch}
                disabled={!metadataJson.trim() || isProcessing}
                className="w-full px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--primary-500)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (metadataJson.trim() && !isProcessing) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                }}
              >
                {isProcessing ? 'Processing...' : 'Preview & Match Questions'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review Matches */}
        {step === 3 && audioMetadata && (
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <Search className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Step 3: Review Matches
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirm question matches for "{audioMetadata.title}"
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {questionMatches.map((match, index) => (
                <div
                  key={index}
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--stroke-soft)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {match.status === 'exact' ? (
                        <CheckCircle className="w-5 h-5" style={{ color: 'var(--success-500)' }} />
                      ) : (
                        <AlertCircle className="w-5 h-5" style={{ color: 'var(--warning-500)' }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        {match.snippet.substring(0, 100)}...
                      </p>
                      {match.status === 'exact' && match.matchedQuestion && (
                        <div
                          className="text-sm p-2 rounded"
                          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-secondary)' }}
                        >
                          ✓ Found exact match: {match.matchedQuestion.question.substring(0, 80)}...
                        </div>
                      )}
                      {match.status === 'none' && (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          No match found - will be available for future implementation
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveAndLink}
              disabled={isProcessing}
              className="w-full px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--primary-500)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500)'
              }}
            >
              {isProcessing ? 'Saving...' : 'Save & Link All'}
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && audioMetadata && (
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
          >
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: 'var(--success-500)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Audio Content Saved Successfully
              </h2>
              <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
                "{audioMetadata.title}" has been added with {questionMatches.length} linked questions
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--primary-500)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-500)'
                  }}
                >
                  Add Another Audio
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid var(--stroke-soft)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  Back to Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

