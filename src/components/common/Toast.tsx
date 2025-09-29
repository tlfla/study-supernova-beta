import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

const toastStyles = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info'
}

export default function Toast({
  type,
  title,
  message,
  duration = 5000,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300) // Match the transition duration
  }

  if (!isVisible) return null

  return (
    <div
      className={clsx(
        'fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 transform',
        toastStyles[type],
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      )}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="text-sm font-medium">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
