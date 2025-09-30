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
  const baseClasses = 'rounded-2xl border p-6'

  const variantClasses = {
    default: '',
    elevated: '',
    outlined: 'border-2'
  }

  const baseStyles = {
    backgroundColor: 'var(--bg-card)',
    boxShadow: 'var(--shadow-raised)',
    borderColor: 'var(--stroke-soft)'
  }

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    className
  )

  return (
    <div className={classes} style={{ ...baseStyles, ...props.style }} {...props}>
      {children}
    </div>
  )
}
