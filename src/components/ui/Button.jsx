import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-md font-body font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-primary text-text-on-primary hover:bg-primary/90',
  secondary: 'bg-background text-text-primary border border-text-primary hover:bg-surface',
  ghost: 'bg-transparent text-text-primary hover:bg-surface',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-base px-6 py-3',
}

function SpinnerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const Button = forwardRef(function Button(
  {
    to,
    href,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    className = '',
    children,
    onClick,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading
  const isLinkLike = Boolean(to || href)
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${isDisabled && isLinkLike ? 'pointer-events-none' : ''} ${
    disabled && !loading && isLinkLike ? 'opacity-50' : ''
  } ${loading ? 'disabled:opacity-100!' : ''} ${className}`.trim()

  const content = (
    <>
      <span className={loading ? 'invisible' : 'contents'}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <SpinnerIcon className="animate-spin" />
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        onClick={isDisabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        onClick={isDisabled ? (event) => event.preventDefault() : onClick}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      ref={ref}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  )
})

export default Button
