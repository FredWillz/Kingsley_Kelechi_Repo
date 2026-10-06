import { useEffect, useState } from 'react'
import Heading from '../../components/ui/Heading.jsx'
import Text from '../../components/ui/Text.jsx'
import LoadingScreen from '../../components/ui/LoadingScreen.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { HistoryIcon } from '../../components/Dashboard/icons.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { listTransactions } from '../../lib/transactions.js'
import { formatCurrency } from '../../lib/format.js'

function TransactionHistory() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false

    listTransactions(user.uid)
      .then((result) => {
        if (!cancelled) setTransactions(result)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your transaction history. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [user?.uid])

  return (
    <div>
      <Heading level={1} size="md">
        Transaction History
      </Heading>
      <Text variant="body" className="mt-2">
        Every transaction on your account, most recent first.
      </Text>

      {error && (
        <Text variant="small" role="alert" className="mt-6 text-primary">
          {error}
        </Text>
      )}

      {!error && transactions === null && (
        <div className="mt-6">
          <LoadingScreen label="Loading your transactions…" />
        </div>
      )}

      {!error && transactions?.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={HistoryIcon}
            title="No transactions yet"
            description="Once you send, receive, or spend money on this account, it'll show up here."
            actionLabel="Transfer funds"
            actionTo="/dashboard/transfer-funds"
          />
        </div>
      )}

      {!error && transactions && transactions.length > 0 && (
        <div className="mt-6 overflow-x-auto border rounded-lg border-text-secondary/15">
          <table className="w-full text-left">
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase font-body text-text-secondary">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase font-body text-text-secondary">
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold text-right uppercase font-body text-text-secondary"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-text-secondary/10">
                  <td className="px-4 py-3 text-sm font-body text-text-primary">{tx.description}</td>
                  <td className="px-4 py-3 text-sm font-body text-text-secondary">{tx.date}</td>
                  <td
                    className={`px-4 py-3 text-right font-body text-sm font-medium ${
                      Number(tx.amount) < 0 ? 'text-text-primary' : 'text-primary'
                    }`}
                  >
                    {Number(tx.amount) < 0 ? '-' : '+'}
                    {user?.currency || 'USD'} {formatCurrency(Math.abs(Number(tx.amount)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
