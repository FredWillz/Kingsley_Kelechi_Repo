import { forwardRef, useId, useState } from 'react'

function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.6 10.6 0 0112 5c7 0 10.5 7 10.5 7a13.3 13.3 0 01-3.13 4.24M6.6 6.6C3.5 8.5 1.5 12 1.5 12s3.5 7 10.5 7a10.4 10.4 0 004.4-.94" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  )
}

const Input = forwardRef(function Input(
  { label, error, hint, id, className = '', type, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="font-body text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={isPassword ? (visible ? 'text' : 'password') : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-md border bg-surface px-3 py-2 font-body text-text-primary placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${error ? 'border-primary' : 'border-text-secondary/30'} ${isPassword ? 'pr-10' : ''} ${className}`.trim()}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="font-body text-xs text-text-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="font-body text-xs text-primary">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
