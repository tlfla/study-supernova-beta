import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

interface MinimalHeaderProps {
  title: string
  rightAction?: React.ReactNode
}

export default function MinimalHeader({ title, rightAction }: MinimalHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b safe-area-padding-top" style={{ borderColor: 'var(--stroke-soft)' }}>
      <div className="flex items-center justify-between h-14 px-4 safe-area-padding-left safe-area-padding-right">
        {/* Home Icon - Better touch target (48x48px min) */}
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-lg transition-colors"
          style={{ color: 'var(--primary-500)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Go to dashboard"
        >
          <Home className="w-6 h-6" />
        </button>
        
        {/* Page Title - Absolutely centered */}
        <h1 
          className="text-lg font-semibold absolute left-1/2 -translate-x-1/2" 
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        
        {/* Optional Right Action - Better touch target */}
        <div className="p-3 -mr-3">
          {rightAction}
        </div>
      </div>
    </header>
  )
}
