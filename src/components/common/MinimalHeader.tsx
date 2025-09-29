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
        {/* Home Icon - Left */}
        <button 
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-lg transition-colors"
          style={{ color: 'var(--primary-500)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 181, 164, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Go to dashboard"
        >
          <Home className="w-6 h-6" />
        </button>
        
        {/* Page Title - Center */}
        <h1 className="text-lg font-semibold flex-1 text-center px-4" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        
        {/* Optional Right Action */}
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  )
}
