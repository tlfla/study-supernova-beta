import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Flashcards() {
  const navigate = useNavigate()

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
              <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
              <p className="text-gray-600">Spaced repetition learning (Coming Soon)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Flashcards Feature
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              This feature is currently under development. Flashcards will use spaced repetition algorithms to help you memorize key concepts and terminology.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Swipe gestures for know/don't know</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Spaced repetition scheduling</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Progress tracking and statistics</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
