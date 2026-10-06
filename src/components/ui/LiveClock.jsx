import { useEffect, useState } from 'react'

function ordinalSuffix(day) {
  if (day % 10 === 1 && day % 100 !== 11) return 'st'
  if (day % 10 === 2 && day % 100 !== 12) return 'nd'
  if (day % 10 === 3 && day % 100 !== 13) return 'rd'
  return 'th'
}

function formatDate(date) {
  const day = date.getDate()
  const month = date.toLocaleDateString(undefined, { month: 'long' })
  const year = date.getFullYear()
  return `${month} ${day}${ordinalSuffix(day)} ${year}`
}

function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatUtcOffset(date) {
  const pad = (n) => String(n).padStart(2, '0')
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

function LiveClock({ className = '' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`.trim()}>
      <span className="text-sm font-medium font-body text-text-primary">{formatDate(now)}</span>
      <span className="text-sm font-body text-text-secondary tabular-nums">{formatTime(now)}</span>
      <span className="text-xs font-body text-text-secondary">
        ({timeZone}, {formatUtcOffset(now)})
      </span>
    </div>
  )
}

export default LiveClock
