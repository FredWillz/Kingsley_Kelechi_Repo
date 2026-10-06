import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Heading from '../../components/ui/Heading.jsx'
import Text from '../../components/ui/Text.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingScreen from '../../components/ui/LoadingScreen.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import LiveClock from '../../components/ui/LiveClock.jsx'
import { HistoryIcon } from '../../components/Dashboard/icons.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { listTransactions } from '../../lib/transactions.js'
import { formatCurrency } from '../../lib/format.js'

function DashboardHome() {
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
        if (!cancelled) setError('Could not load your recent transactions. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [user?.uid])

  const recentTransactions = transactions?.slice(0, 5) ?? []

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Heading level={1} size="md">
            Welcome back,
          </Heading>
          <Heading level={1} size="md" className="mt-1 font-medium break-words">
            {user?.name}
          </Heading>
          <Text variant="body" className="mt-3">
            Here's what's happening with your account today.
          </Text>
        </div>
        <LiveClock />
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-3">
        <div className="p-6 border rounded-lg border-text-secondary/15 bg-surface lg:col-span-2">
          <Text variant="small">Available balance</Text>
          <p className="mt-1 text-3xl font-semibold font-heading text-text-primary">
            {user?.currency || 'USD'} {formatCurrency(user?.balance)}
          </p>
          <p className="mt-1 text-xs font-body text-text-secondary">
            Account ending in {user?.accountNumber?.slice(-4)}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button to="/dashboard/transfer-funds" size="sm">
              Transfer funds
            </Button>
            <Button to="/dashboard/profile/add-beneficiary" variant="secondary" size="sm">
              Add beneficiary
            </Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg border-text-secondary/15 bg-surface">
          <Text variant="small">Quick links</Text>
          <ul className="flex flex-col gap-2 mt-3">
            <li>
              <Link
                to="/dashboard/transaction-history"
                className="text-sm font-medium font-body text-primary hover:underline"
              >
                View transaction history
              </Link>
            </li>
            <li>
              <Link to="/dashboard/profile" className="text-sm font-medium font-body text-primary hover:underline">
                Manage profile
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/user-guide"
                className="text-sm font-medium font-body text-primary hover:underline"
              >
                Read the user guide
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Heading level={2} size="sm">
          Recent transactions
        </Heading>

        {error && (
          <Text variant="small" role="alert" className="mt-4 text-primary">
            {error}
          </Text>
        )}

        {!error && transactions === null && (
          <div className="mt-4">
            <LoadingScreen label="Loading your recent transactions…" />
          </div>
        )}

        {!error && transactions !== null && recentTransactions.length === 0 && (
          <div className="mt-4">
            <EmptyState
              icon={HistoryIcon}
              title="No recent activity"
              description="Once you send, receive, or spend money on this account, it'll show up here."
              actionLabel="Transfer funds"
              actionTo="/dashboard/transfer-funds"
            />
          </div>
        )}

        {!error && recentTransactions.length > 0 && (
          <div className="mt-4 overflow-x-auto border rounded-lg border-text-secondary/15">
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
                {recentTransactions.map((tx) => (
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
    </div>
  )
}

export default DashboardHome
