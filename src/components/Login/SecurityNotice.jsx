import { useState } from 'react'
import Text from '../ui/Text.jsx'
import { InfoIcon } from './icons.jsx'
import { CloseIcon } from '../Navbar/icons.jsx'

function SecurityNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="region"
      aria-label="Security notice"
      className="flex gap-3 rounded-md border border-text-secondary/20 bg-surface p-4"
    >
      <InfoIcon className="mt-0.5 shrink-0 text-primary" />
      <div className="flex-1">
        <p className="font-heading text-sm font-semibold text-text-primary">
          Stay alert for scam calls and messages
        </p>
        <Text variant="small" className="mt-1">
          Be cautious of unsolicited calls, texts, or messages asking you to move money urgently.
          Scammers may pose as HSBC staff and use spoofed numbers to sound convincing. If anyone
          asks you to transfer funds to a "safe" account or approve a transaction you didn't start, hang
          up and contact us using the number on the back of your card. HSBC will never ask you to
          move money to keep it safe.
        </Text>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss security notice"
        className="shrink-0 rounded-sm p-1 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <CloseIcon width="18" height="18" />
      </button>
    </div>
  )
}

export default SecurityNotice
