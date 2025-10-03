import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './state/AppContext'
import { DataProvider } from './data/providers/DataProvider'
import Dashboard from './pages/Dashboard'
import QuizOptions from './pages/QuizOptions'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Review from './pages/Review'
import Study from './pages/Study'
import Flashcards from './pages/Flashcards'
import AudioDetail from './pages/AudioDetail'
import Profile from './pages/Profile'
import Setup from './pages/Setup'
import Admin from './pages/Admin'
import AdminAudio from './pages/AdminAudio'
import BottomTabBar from './components/common/BottomTabBar'
import './App.css'

function App() {
  const dataProvider = DataProvider.getInstance()

  // If provider is not mock but not properly configured, show setup
  if (dataProvider.getProviderType() !== 'mock' && !dataProvider.isConfigured()) {
    return (
      <AppProvider>
        <Setup />
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <div className="min-h-screen-safe bg-gray-50 pb-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz-options" element={<QuizOptions />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/review" element={<Review />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/flashcards/:type" element={<Flashcards />} />
          <Route path="/study/audio/:category" element={<AudioDetail />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/audio" element={<AdminAudio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomTabBar />
      </div>
    </AppProvider>
  )
}

export default App
