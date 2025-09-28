import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  children: React.ReactNode
}

export default function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl p-6'

  const variantClasses = {
    default: 'shadow-sm border border-gray-200',
    elevated: 'shadow-lg border border-gray-200',
    outlined: 'border-2 border-gray-300'
  }

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
