import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Headphones, ArrowRight, Shield } from 'lucide-react'
import DesktopHeader from '../components/common/DesktopHeader'
import MinimalHeader from '../components/common/MinimalHeader'

// TODO: Add Supabase auth check for admin role

export default function Admin() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen-safe pb-20 md:pb-0" style={{ backgroundColor: 'var(--bg-base)' }}>
      <MinimalHeader title="Admin" />
      <DesktopHeader />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-28 pb-8 safe-area-padding-left safe-area-padding-right safe-area-padding-bottom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
            >
              <Shield className="w-6 h-6" style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Admin Dashboard
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage study content and resources
              </p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/admin/audio')}
            className="w-full rounded-2xl border p-6 text-left transition-all hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-raised)',
              borderColor: 'var(--stroke-soft)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-emphasis)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-raised)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(17, 181, 164, 0.1)' }}
                >
                  <Headphones className="w-7 h-7" style={{ color: 'var(--primary-500)' }} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Manage Audio Content
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Upload and link audio study materials to questions
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

