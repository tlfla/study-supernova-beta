import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, Palette, Save, Edit, Check, X } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toast from '../components/common/Toast'
import MinimalHeader from '../components/common/MinimalHeader'

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Anatomy & Physiology': '#E85D75',
    'Microbiology': '#4CAF82',
    'Pharmacology': '#4A9FE8',
    'Sterilization and Decontamination': '#8B7BC7',
    'Cardiovascular': '#E85D6B',
    'General Surgery': '#6B7280',
    'Genitourinary': '#F5B947',
    'Neurology': '#5A7C99',
    'Ophthalmic': '#FF9F5A',
    'Orthopedic': '#5BA3D4',
    'Otorhinolaryngology': '#64B5F6',
    'Peripheral Vascular': '#F08C84',
    'Plastics and Reconstructive': '#EDAD5C',
    'Obstetrics and Gynecology': '#E88A8A',
    'Preoperative': '#52C9B0',
    'Postoperative': '#F4D03F',
    'Professional and Administrative Responsibilities': '#B591D6',
    'Surgical Procedures': '#6B7280',
    'Instrumentation': '#5BA3D4',
    'Patient Care': '#52C9B0',
    'Medical Ethics': '#B591D6',
    'Emergency Procedures': '#E85D6B',
    'Post-Operative Care': '#F4D03F'
  };
  return colors[category] || '#11B5A4';
}

export default function Profile() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const [showEditModal, setShowEditModal] = useState(false)
  const [name, setName] = useState(state.currentUser?.name || 'John Doe')
  const [email, setEmail] = useState(state.currentUser?.email || 'student@example.com')
  const [examDate, setExamDate] = useState('2024-12-15')

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    highContrast: false
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleSave = async () => {
    // TODO: Save to database
    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        type: 'success',
        title: 'Profile Updated',
        message: 'Your changes have been saved successfully.'
      }
    })
    setShowEditModal(false)
  }

  const handleSaveSettings = () => {
    // In a real app, you would save these to localStorage or send to backend
    localStorage.setItem('app-settings', JSON.stringify(settings))

    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        type: 'success',
        title: 'Settings Saved',
        message: 'Your preferences have been updated successfully.'
      }
    })
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen-safe bg-gray-50 pb-20">
      <MinimalHeader title="Profile" />

      {/* Content */}
      <main className="pt-16 px-4 py-8 max-w-4xl mx-auto safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* User Info Card - Simplified */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" style={{ borderColor: 'var(--stroke-soft)' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
              >
                <User className="w-8 h-8" style={{ color: 'var(--primary-600)' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {name}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {email}
                </p>
              </div>
            </div>
            
            {/* Edit button inline */}
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--primary-500)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
          
          {/* Exam Date Display */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--stroke-soft)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Exam Date
              </span>
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatDate(examDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
            onClick={() => setShowEditModal(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Edit Profile
                </h3>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-white transition-all focus:outline-none"
                    style={{ 
                      borderColor: 'var(--border-muted)', 
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
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-white transition-all focus:outline-none"
                    style={{ 
                      borderColor: 'var(--border-muted)', 
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
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-white transition-all focus:outline-none"
                    style={{ 
                      borderColor: 'var(--border-muted)', 
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
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 font-semibold transition-all hover:bg-gray-50"
                  style={{ 
                    borderColor: 'var(--border-muted)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl text-white font-semibold transition-all shadow-md"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-500)'}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive reminders and updates</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: settings.notifications ? 'var(--primary-500)' : '#E5E7EB',
                  boxShadow: settings.notifications ? `0 0 0 2px var(--primary-500)` : 'none'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 text-gray-400">🔊</div>
                <div>
                  <p className="font-medium text-gray-900">Sound Effects</p>
                  <p className="text-sm text-gray-600">Play sounds for interactions</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('soundEffects')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: settings.soundEffects ? 'var(--primary-500)' : '#E5E7EB'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Use dark theme</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: settings.darkMode ? 'var(--primary-500)' : '#E5E7EB'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">High Contrast Mode</p>
                  <p className="text-sm text-gray-600">Enhanced visibility for accessibility</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('highContrast')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: settings.highContrast ? 'var(--primary-500)' : '#E5E7EB'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="mb-8" id="performance">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
          <div className="space-y-4">
            {[
              { name: 'Anatomy & Physiology', score: 85, attempted: 45 },
              { name: 'Surgical Procedures', score: 78, attempted: 38 },
              { name: 'Instrumentation', score: 92, attempted: 52 },
              { name: 'Sterilization', score: 88, attempted: 41 },
              { name: 'Patient Care', score: 76, attempted: 35 },
              { name: 'Microbiology', score: 81, attempted: 28 },
              { name: 'Pharmacology', score: 73, attempted: 30 },
              { name: 'Medical Ethics', score: 90, attempted: 22 },
              { name: 'Emergency Procedures', score: 69, attempted: 18 },
              { name: 'Post-Operative Care', score: 84, attempted: 25 }
            ].map((category) => (
              <div key={category.name} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {category.name}
                  </span>
                  <span className="text-sm font-bold" style={{ color: getCategoryColor(category.name) }}>
                    {category.score}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-raised)' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${category.score}%`,
                      backgroundColor: getCategoryColor(category.name)
                    }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {category.attempted} attempted
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Your Stats */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--primary-500)' }}>
                {state.userProgress.reduce((sum, p) => sum + p.questions_attempted, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Questions Attempted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--success-500)' }}>
                {state.userProgress.reduce((sum, p) => sum + p.questions_correct, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--primary-500)' }}>
                {state.userProgress.length > 0
                  ? Math.round(state.userProgress.reduce((sum, p) => sum + p.best_score, 0) / state.userProgress.length)
                  : 0
                }%
              </p>
              <p className="text-sm text-gray-600 mt-1">Average Score</p>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">App Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Provider</span>
              <span className="font-medium" style={{ color: 'var(--primary-500)' }}>Mock Data</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Available</span>
              <span className="font-medium">60+</span>
            </div>
          </div>
        </Card>
      </main>

      {/* Toast */}
      {state.toast && (
        <Toast
          type={state.toast.type}
          title={state.toast.title}
          message={state.toast.message}
          onClose={() => dispatch({ type: 'HIDE_TOAST' })}
        />
      )}
    </div>
  )
}
