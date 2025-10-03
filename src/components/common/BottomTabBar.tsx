import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, RotateCcw, GraduationCap, User, Play } from 'lucide-react'
import { clsx } from 'clsx'
import { getPrimaryWithOpacity } from '../../lib/colors'

interface TabItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: TabItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/quiz-options', label: 'Quiz', icon: Play },
  { path: '/review', label: 'Review', icon: RotateCcw },
  { path: '/study', label: 'Study', icon: GraduationCap },
  { path: '/profile', label: 'Profile', icon: User }
]

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide bottom nav during active quiz
  if (location.pathname === '/quiz') return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 safe-area-inset-bottom z-50">
      <div 
        className="backdrop-blur-xl border-t"
        style={{
          background: 'var(--glass-bg)',
          borderTopColor: 'var(--glass-border)',
          boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.04)'
        }}
      >
        <div className="flex justify-around items-center h-16 px-4 safe-area-padding-bottom safe-area-padding-left safe-area-padding-right">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 min-w-0"
                style={{
                  color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? getPrimaryWithOpacity(0.1) : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--primary-500)'
                    e.currentTarget.style.backgroundColor = getPrimaryWithOpacity(0.05)
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon className="h-6 w-6 mb-1 transition-colors duration-200" />
                <span 
                  className="text-[12px] leading-tight font-medium truncate w-full text-center"
                  style={{ fontSize: 'max(12px, 1rem)' }}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
