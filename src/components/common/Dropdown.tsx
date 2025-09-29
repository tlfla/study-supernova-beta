import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = ''
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return

    onChange?.(option.value)
    setIsOpen(false)
  }

  const baseClasses = 'relative w-full'
  const triggerClasses = clsx(
    'flex items-center justify-between w-full rounded-xl px-3 py-2 cursor-pointer transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )
  
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div className={baseClasses} ref={dropdownRef}>
      <button
        type="button"
        className={triggerClasses}
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderWidth: '1px', 
          borderStyle: 'solid', 
          borderColor: isHovered && !disabled ? 'var(--border-strong)' : 'var(--border-muted)' 
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
      >
        <span className={clsx(
          'block truncate',
          !selectedOption && 'text-gray-500'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'h-5 w-5 text-gray-400 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-muted)' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200',
                'focus:outline-none focus:bg-gray-50',
                option.disabled && 'opacity-50 cursor-not-allowed',
                selectedOption?.value === option.value && 'bg-primary-50 text-primary-600'
              )}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
