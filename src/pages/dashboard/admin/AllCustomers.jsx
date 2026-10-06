import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Button from '../../../components/ui/Button.jsx'
import LoadingScreen from '../../../components/ui/LoadingScreen.jsx'
import { listCustomers } from '../../../lib/customers.js'
import { formatCurrency } from '../../../lib/format.js'

function AllCustomers() {
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    listCustomers()
      .then((result) => {
        if (!cancelled) setCustomers(result)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load customers. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level={1} size="md">
            All Customers
          </Heading>
          <Text variant="body" className="mt-2">
            Every customer account in real time.
          </Text>
        </div>
        <Button to="/dashboard/admin/customers/add" size="sm">
          Add customer
        </Button>
      </div>

      {error && (
        <Text variant="small" role="alert" className="mt-6 text-primary">
          {error}
        </Text>
      )}

      {!error && customers === null && (
        <div className="mt-6">
          <LoadingScreen label="Loading customers…" />
        </div>
      )}

      {!error && customers?.length === 0 && (
        <Text variant="small" className="mt-6">
          No customers yet. Create one to get started.
        </Text>
      )}

      {!error && customers && customers.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-text-secondary/15">
          <table className="w-full text-left">
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  SN
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Full Name
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Account Number
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Account Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right font-body text-xs font-semibold uppercase text-text-secondary"
                >
                  Balance
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.uid} className="border-t border-text-secondary/10">
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">{index + 1}</td>
                  <td className="px-4 py-3 font-body text-sm font-medium text-text-primary">
                    {customer.name || '—'}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">{customer.email || '—'}</td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {customer.accountNumber || '—'}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {customer.accountType || '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-body text-sm text-text-primary">
                    {customer.currency || 'USD'} {formatCurrency(customer.balance)}
                  </td>
                  <td className="px-4 py-3 font-body text-sm">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          customer.status === 'active' ? 'bg-green-500' : 'bg-text-secondary/40'
                        }`}
                        aria-hidden="true"
                      />
                      <span className={customer.status === 'active' ? 'text-green-600' : 'text-text-secondary'}>
                        {customer.status || 'unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/dashboard/admin/customers/${customer.uid}`}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/dashboard/admin/customers/${customer.uid}/edit`}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
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

export default AllCustomers
