import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, PlayCircle, RotateCcw, BookOpen, User, ChevronDown } from 'lucide-react'
import { useAppContext } from '../../state/AppContext'

export default function DesktopHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAppContext()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/quiz-options', label: 'Quiz', icon: PlayCircle },
    { path: '/review', label: 'Review', icon: RotateCcw },
    { path: '/study', label: 'Study', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header 
      className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b"
      style={{ 
        height: '64px',
        borderColor: 'var(--stroke-soft)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left - Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary-500)' }}
          >
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            PrepLift
          </span>
        </div>

        {/* Center - Navigation Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: active ? 'rgba(17, 181, 164, 0.1)' : 'transparent',
                  color: active ? 'var(--primary-600)' : 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-raised)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right - User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-raised)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--primary-600)' }} />
            </div>
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl border shadow-lg z-50"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: 'var(--stroke-soft)'
                }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'var(--stroke-soft)' }}>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    John Doe
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    student@example.com
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-raised)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    View Profile
                  </button>
                  <div className="my-1 border-t" style={{ borderColor: 'var(--stroke-soft)' }} />
                  <button
                    onClick={async () => {
                      setShowUserMenu(false)
                      await logout()
                      navigate('/')
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                    style={{ color: 'var(--danger-500)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

