import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import Button from '../ui/Button.jsx'
import { notifySuccess } from '../../lib/toast.js'

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
      <path d="M8 12l2 2 4-4" />
    </svg>
  )
}

function TransferSuccessModal({ open, onClose, transferDetails, currency = 'NGN' }) {
  const [isCopied, setIsCopied] = useState(false)

  if (!transferDetails) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount))
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircleIcon />
        </div>

        <div className="text-center">
          <Heading level={2} size="sm">
            Transfer Successful
          </Heading>
          <Text variant="small" className="mt-1 text-text-secondary">
            Your funds have been transferred successfully
          </Text>
        </div>

        <div className="w-full space-y-3 rounded-lg bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <Text variant="small" className="text-text-secondary">
              Recipient Name
            </Text>
            <Text className="font-medium text-right">
              {transferDetails.name}
            </Text>
          </div>

          <div className="flex items-start justify-between border-t border-text-secondary/10 pt-3">
            <Text variant="small" className="text-text-secondary">
              Account Number
            </Text>
            <Text className="font-medium text-right font-mono text-sm">
              {transferDetails.accountNumber}
            </Text>
          </div>

          <div className="flex items-start justify-between border-t border-text-secondary/10 pt-3">
            <Text variant="small" className="text-text-secondary">
              Bank Name
            </Text>
            <Text className="font-medium text-right">
              {transferDetails.bankName}
            </Text>
          </div>

          <div className="flex items-start justify-between border-t border-text-secondary/10 pt-3">
            <Text variant="small" className="text-text-secondary">
              Amount Transferred
            </Text>
            <Text className="font-semibold text-right text-red-600">
              -{formatCurrency(transferDetails.amount)}
            </Text>
          </div>

          <div className="flex items-start justify-between border-t border-text-secondary/10 pt-3">
            <Text variant="small" className="text-text-secondary">
              Date & Time
            </Text>
            <div className="text-right">
              <Text className="font-medium text-sm">
                {getCurrentDate()}
              </Text>
              <Text variant="small" className="text-text-secondary">
                {getCurrentTime()}
              </Text>
            </div>
          </div>
        </div>

        <div className="w-full space-y-2 border-t border-text-secondary/10 pt-4">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const details = [
                `Recipient: ${transferDetails.name}`,
                `Account: ${transferDetails.accountNumber}`,
                `Bank: ${transferDetails.bankName}`,
                `Amount: ${formatCurrency(transferDetails.amount)}`,
                `Date: ${getCurrentDate()} at ${getCurrentTime()}`,
              ].join('\n')
              navigator.clipboard.writeText(details)
              notifySuccess('Details copied to clipboard')
              setIsCopied(true)
              setTimeout(() => setIsCopied(false), 2000)
            }}
          >
            {isCopied ? '✓ Copied!' : 'Copy Details'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TransferSuccessModal
