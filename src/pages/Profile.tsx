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
              <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.notifications ? 'bg-primary-500' : 'bg-gray-200'
                }`}
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.soundEffects ? 'bg-primary-500' : 'bg-gray-200'
                }`}
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.darkMode ? 'bg-primary-500' : 'bg-gray-200'
                }`}
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.highContrast ? 'bg-primary-500' : 'bg-gray-200'
                }`}
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

        {/* Your Stats */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {state.userProgress.reduce((sum, p) => sum + p.questions_attempted, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Questions Attempted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {state.userProgress.reduce((sum, p) => sum + p.questions_correct, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
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
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">App Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Provider</span>
              <span className="font-medium text-primary-600">Mock Data</span>
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
