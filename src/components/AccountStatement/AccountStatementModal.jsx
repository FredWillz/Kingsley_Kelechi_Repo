import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
// import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import { listStatement } from '../../lib/statement.js'
import { useAuth } from '../../hooks/useAuth.js'

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M9 3v4M15 3v4" />
    </svg>
  )
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3v12M6 13l6 6 6-6" />
      <path d="M3 19h18" />
    </svg>
  )
}

function EmptyTransactionsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 4.5A1.5 1.5 0 016.5 3H17a2 2 0 012 2v14a2 2 0 01-2 2H6.5A1.5 1.5 0 015 19.5v-15z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
      <path d="M3 3l18 18" />
    </svg>
  )
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(Math.abs(amount))
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isDateInRange(txDate, startDate, endDate) {
  if (!txDate) return false
  const txTime = new Date(txDate).getTime()
  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()
  return txTime >= startTime && txTime <= endTime
}

function AccountStatementModal({ open, onClose }) {
  const { user } = useAuth()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetched, setFetched] = useState(false)

  const handleFetchTransactions = async () => {
    setError('')
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start > end) {
      setError('Start date must be before end date')
      return
    }

    setLoading(true)
    try {
      const allTransactions = await listStatement(user.uid)
      const filtered = allTransactions.filter((tx) =>
        isDateInRange(tx.date, startDate, endDate),
      )
      setTransactions(filtered)
      setFetched(true)
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStartDate('')
    setEndDate('')
    setTransactions([])
    setError('')
    setFetched(false)
    onClose()
  }

  const totalDebit = transactions
    .filter((tx) => (tx.amount || 0) < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0)

  const totalCredit = transactions
    .filter((tx) => (tx.amount || 0) > 0)
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)

  return (
    <Modal open={open} onClose={handleClose} title="Account Statement">
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-1.5">
                From Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-text-secondary/30 bg-surface text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-1.5">
                To Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-text-secondary/30 bg-surface text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-primary font-medium" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleFetchTransactions}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Fetching...' : 'Pull Statement'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>

        {fetched && (
          <div className="space-y-4">
            {transactions.length > 0 && (
              <div className="grid grid-cols-2 gap-3 bg-primary/5 rounded-lg p-4">
                <div>
                  <Text variant="small" className="text-text-secondary mb-1">
                    Total Credits
                  </Text>
                  <Text className="font-semibold text-green-600">
                    {formatCurrency(totalCredit)}
                  </Text>
                </div>
                <div>
                  <Text variant="small" className="text-text-secondary mb-1">
                    Total Debits
                  </Text>
                  <Text className="font-semibold text-red-600">
                    {formatCurrency(totalDebit)}
                  </Text>
                </div>
              </div>
            )}

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 text-text-secondary/40">
                  <EmptyTransactionsIcon />
                </div>
                <Heading level={3} size="sm" className="mb-1">
                  No transactions found
                </Heading>
                <Text variant="small" className="text-text-secondary">
                  There are no transactions for the selected date range.
                </Text>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <Heading level={3} size="sm">
                  Transactions
                </Heading>
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-text-secondary/10 bg-surface p-3 hover:bg-surface/80 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <Text className="font-medium text-text-primary truncate">
                          {tx.description}
                        </Text>
                        <Text variant="small" className="text-text-secondary mt-0.5">
                          {formatDate(tx.date)}
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text
                          className={`font-semibold whitespace-nowrap ${
                            (tx.amount || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {(tx.amount || 0) > 0 ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </Text>
                        {tx.balance !== null && (
                          <Text variant="small" className="text-text-secondary mt-0.5">
                            Bal: {formatCurrency(tx.balance)}
                          </Text>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                const csvContent = [
                  ['Date', 'Description', 'Amount', 'Balance'],
                  ...transactions.map((tx) => [
                    tx.date || '-',
                    tx.description || '-',
                    tx.amount || '-',
                    tx.balance !== null ? tx.balance : '-',
                  ]),
                ]
                  .map((row) => row.map((cell) => `"${cell}"`).join(','))
                  .join('\n')

                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `statement-${startDate}-to-${endDate}.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
              }}
            >
              <DownloadIcon className="mr-2" />
              Download CSV
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AccountStatementModal
