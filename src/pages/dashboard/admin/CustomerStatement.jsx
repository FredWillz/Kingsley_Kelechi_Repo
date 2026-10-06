import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Button from '../../../components/ui/Button.jsx'
import Modal from '../../../components/ui/Modal.jsx'
import LoadingScreen from '../../../components/ui/LoadingScreen.jsx'
import { getUserProfile } from '../../../lib/userProfile.js'
import { listStatement, removeStatementEntry } from '../../../lib/statement.js'
import { notifyError, notifySuccess } from '../../../lib/toast.js'
import { formatCurrency, formatDate } from '../../../lib/format.js'

const columnHeaderClass = 'px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary'

function CustomerStatement() {
  const { uid } = useParams()
  const [customer, setCustomer] = useState(null)
  const [entries, setEntries] = useState(null)
  const [status, setStatus] = useState('loading')
  const [pendingRemoval, setPendingRemoval] = useState(null)
  const [removing, setRemoving] = useState(false)

  const load = useCallback(() => {
    let cancelled = false

    Promise.all([getUserProfile(uid), listStatement(uid)])
      .then(([profile, statement]) => {
        if (cancelled) return
        if (!profile) {
          setStatus('not-found')
          return
        }
        setCustomer(profile)
        setEntries(statement)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  useEffect(() => load(), [load])

  async function handleRemove() {
    if (!pendingRemoval) return
    setRemoving(true)
    try {
      await removeStatementEntry(uid, pendingRemoval)
      notifySuccess('Transaction removed.')
      setPendingRemoval(null)
      load()
    } catch (err) {
      notifyError(err, 'Could not remove this transaction.')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="font-body text-xs text-text-secondary">
          <Link to="/dashboard/admin/customers" className="hover:text-primary hover:underline">
            Home
          </Link>{' '}
          /{' '}
          <Link to={`/dashboard/admin/customers/${uid}`} className="hover:text-primary hover:underline">
            {customer?.name || 'Customer'}
          </Link>{' '}
          / <span className="text-text-primary">Statement</span>
        </nav>
        <Link
          to={`/dashboard/admin/customers/${uid}`}
          className="font-body text-sm font-medium text-primary hover:underline"
        >
          ← Back to customer profile
        </Link>
      </div>

      <Heading level={1} size="md" className="mt-4">
        Account Statement
      </Heading>
      {customer && (
        <Text variant="body" className="mt-2">
          {customer.name} · {customer.currency || 'USD'} {formatCurrency(customer.balance)}
        </Text>
      )}

      {status === 'loading' && (
        <div className="mt-6">
          <LoadingScreen label="Loading statement…" />
        </div>
      )}

      {status === 'not-found' && (
        <Text variant="small" className="mt-6">
          No customer found for this account.
        </Text>
      )}

      {status === 'error' && (
        <Text variant="small" role="alert" className="mt-6 text-primary">
          Could not load this statement. Please try again.
        </Text>
      )}

      {status === 'ready' && customer && entries && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-text-secondary/15">
          <table className="w-full text-left">
            <thead className="bg-surface">
              <tr>
                <th scope="col" className={columnHeaderClass}>
                  Date
                </th>
                <th scope="col" className={columnHeaderClass}>
                  Narration
                </th>
                <th scope="col" className={columnHeaderClass}>
                  Status
                </th>
                <th scope="col" className={`${columnHeaderClass} text-right`}>
                  Credit
                </th>
                <th scope="col" className={`${columnHeaderClass} text-right`}>
                  Debit
                </th>
                <th scope="col" className={`${columnHeaderClass} text-right`}>
                  Balance
                </th>
                <th scope="col" className={columnHeaderClass}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-text-secondary/10">
                <td className="px-4 py-3 font-body text-sm text-text-secondary">—</td>
                <td className="px-4 py-3 font-body text-sm font-medium text-text-primary">Balance BF</td>
                <td className="px-4 py-3 font-body text-sm text-text-secondary">—</td>
                <td className="px-4 py-3 text-right font-body text-sm text-text-secondary">
                  {formatCurrency(0)}
                </td>
                <td className="px-4 py-3 text-right font-body text-sm text-text-secondary">—</td>
                <td className="px-4 py-3 text-right font-body text-sm text-text-secondary">
                  {formatCurrency(0)}
                </td>
                <td className="px-4 py-3 font-body text-sm text-text-secondary">—</td>
              </tr>

              {entries.map((entry) => {
                const amount = Number(entry.amount) || 0
                const isCredit = amount >= 0

                return (
                  <tr key={entry.id} className="border-t border-text-secondary/10">
                    <td className="px-4 py-3 font-body text-sm text-text-secondary">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-text-primary">
                      {entry.description || '—'}
                    </td>
                    <td className="px-4 py-3 font-body text-sm font-medium capitalize text-green-600">
                      {entry.status || 'successful'}
                    </td>
                    <td className="px-4 py-3 text-right font-body text-sm text-text-primary">
                      {isCredit ? formatCurrency(amount) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-body text-sm text-text-primary">
                      {!isCredit ? formatCurrency(Math.abs(amount)) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-body text-sm font-semibold text-text-primary">
                      {formatCurrency(entry.balance)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm">
                      <button
                        type="button"
                        onClick={() => setPendingRemoval(entry)}
                        className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}

              {entries.length === 0 && (
                <tr className="border-t border-text-secondary/10">
                  <td colSpan={7} className="px-4 py-6 text-center font-body text-sm text-text-secondary">
                    No transactions recorded for this account yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(pendingRemoval)} onClose={() => setPendingRemoval(null)} title="Remove transaction">
        <Text variant="body">
          Remove "{pendingRemoval?.description}" dated {formatDate(pendingRemoval?.date)} from this statement?
          The customer's balance will be adjusted accordingly.
        </Text>
        <div className="mt-5 flex gap-3">
          <Button onClick={handleRemove} loading={removing} className="flex-1">
            Remove
          </Button>
          <Button variant="secondary" onClick={() => setPendingRemoval(null)} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CustomerStatement
