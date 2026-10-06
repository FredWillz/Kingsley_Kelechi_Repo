export function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" {...props}>
      <rect x="6" y="2" width="12" height="18" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9l3 3 3-3M12 12V6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AppleLogo(props) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.365 1.43c0 1.14-.415 2.06-1.245 2.76-.995.83-2.19 1.29-3.29 1.2-.02-.11-.03-.24-.03-.4 0-1.06.46-2.13 1.26-2.9C13.71.55 15.02.03 16.11 0c.02.14.04.28.04.43zm4.565 16.4c-.635 1.44-.94 2.08-1.76 3.35-1.15 1.75-2.77 3.93-4.78 3.94-1.79.02-2.25-1.17-4.68-1.16-2.43.01-2.93 1.18-4.72 1.16-2.01-.02-3.55-1.98-4.7-3.73C-2.34 16.66-2.7 10.9.86 7.66c1.87-1.7 3.9-1.83 4.68-1.83.9 0 2.61.83 4.68.83 1.98 0 3.32-.85 4.68-.85.86 0 3.06.12 4.71 2.47-.12.08-2.82 1.65-2.79 4.93.03 3.93 3.44 5.24 3.48 5.26z" />
    </svg>
  )
}

function GooglePlayLogo(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path d="M3.6 2.3c-.35.2-.6.55-.6 1v17.4c0 .45.25.8.6 1l10.05-9.7L3.6 2.3z" fill="#00D2FF" />
      <path d="M17.1 9.4l-3.15 1.6-2.9-2.8 2.9-2.8 3.15 1.6c.85.45.85 1.95 0 2.4z" fill="#FFC400" />
      <path d="M13.65 11l-10.05 9.7c.15.08.3.13.47.13.2 0 .4-.05.58-.15l11.8-6.75L13.65 11z" fill="#FF3A44" />
      <path d="M13.65 11l2.8-2.7-11.8-6.75c-.18-.1-.38-.15-.58-.15-.17 0-.32.05-.47.13L13.65 11z" fill="#00F076" />
    </svg>
  )
}

export function AppStoreBadge(props) {
  const { className = '', ...rest } = props
  return (
    <a
      href="https://www.apple.com/app-store/"
      aria-label="Download on the App Store"
      className={`inline-flex items-center gap-2.5 rounded-lg border border-white/25 bg-black px-4 py-2 text-white transition-colors hover:bg-black/80 ${className}`}
      {...rest}
    >
      <AppleLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[11px]">Download on the</span>
        <span className="font-heading text-xl leading-tight font-semibold">App Store</span>
      </span>
    </a>
  )
}

export function GooglePlayBadge(props) {
  const { className = '', ...rest } = props
  return (
    <a
      href="https://play.google.com/store/apps"
      aria-label="Get it on Google Play"
      className={`inline-flex items-center gap-2.5 rounded-lg border border-white/25 bg-black px-4 py-2 text-white transition-colors hover:bg-black/80 ${className}`}
      {...rest}
    >
      <GooglePlayLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[11px]">GET IT ON</span>
        <span className="font-heading text-xl leading-tight font-semibold">Google Play</span>
      </span>
    </a>
  )
}
