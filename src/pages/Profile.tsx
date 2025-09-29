import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Bell, Shield, Palette, Save } from 'lucide-react'
import { useAppContext } from '../state/AppContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toast from '../components/common/Toast'

export default function Profile() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    highContrast: false
  })

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
              <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* User Info */}
        <Card className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {state.currentUser?.name || 'Student'}
              </h2>
              <p className="text-gray-600">{state.currentUser?.email}</p>
              <p className="text-sm text-gray-500">
                Class: {state.currentUser?.class_code} • Campus: {state.currentUser?.campus_id}
              </p>
            </div>
          </div>
        </Card>

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
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{category.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{category.attempted} attempted</span>
                    <span className="font-bold text-gray-900 min-w-[45px] text-right">{category.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${category.score}%`,
                      backgroundColor: 'var(--primary-500)'
                    }}
                  />
                </div>
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
      </div>

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
