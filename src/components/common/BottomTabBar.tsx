import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, RotateCcw, GraduationCap, User, Play } from 'lucide-react'
import { clsx } from 'clsx'

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

  return (
    <div className="fixed bottom-0 left-0 right-0 safe-area-inset-bottom z-50">
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around py-2 px-4 safe-area-padding-bottom safe-area-padding-left safe-area-padding-right">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={clsx(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 relative',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-500'
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary-500/10 rounded-lg"></div>
              )}
              <Icon
                className={clsx(
                  'h-6 w-6 mb-1 transition-colors duration-200 relative z-10',
                  isActive ? 'text-primary-600' : 'text-gray-400'
                )}
              />
              <span className={clsx(
                'text-[12px] leading-tight font-medium truncate w-full text-center relative z-10',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )}
              style={{ fontSize: 'max(12px, 1rem)' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
        </div>
      </div>
    </div>
  )
}
