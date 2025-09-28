import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, FileText, Download } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Study() {
  const navigate = useNavigate()

  const studySections = [
    {
      title: 'Deep Dives',
      description: 'Comprehensive guides on surgical procedures and techniques',
      icon: BookOpen,
      items: [
        'Asepsis and Sterile Technique',
        'Surgical Instrumentation',
        'Anesthesia Principles',
        'Wound Healing and Closure'
      ]
    },
    {
      title: 'Key Concepts',
      description: 'Essential terminology and fundamental principles',
      icon: FileText,
      items: [
        'Anatomical Positions and Planes',
        'Medical Terminology Basics',
        'Infection Control Protocols',
        'Patient Safety Standards'
      ]
    },
    {
      title: 'Reference Sheets',
      description: 'Quick reference materials and checklists',
      icon: Download,
      items: [
        'Surgical Counts Checklist',
        'Instrument Identification Guide',
        'Common Suture Types',
        'Sterilization Methods'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
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
              <h1 className="text-2xl font-bold text-gray-900">Study Area</h1>
              <p className="text-gray-600">Deep dive into surgical technology concepts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {studySections.map((section) => (
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
                    className="bg-white/50 hover:bg-white/70 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-primary-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{item}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Coming soon - detailed study materials
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <ArrowLeft className="h-4 w-4 rotate-180" />
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
              We're working on comprehensive study materials including swipe-based flashcards,
              spaced repetition scheduling, and progress tracking. Stay tuned for updates!
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
