import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Button from '../../../components/ui/Button.jsx'
import Input from '../../../components/ui/Input.jsx'
import Modal from '../../../components/ui/Modal.jsx'
import LoadingScreen from '../../../components/ui/LoadingScreen.jsx'
import { getUserProfile } from '../../../lib/userProfile.js'
import { creditCustomer, debitCustomer } from '../../../lib/statement.js'
import { notifyError, notifySuccess } from '../../../lib/toast.js'
import { formatCurrency } from '../../../lib/format.js'

const personalRows = [
  ['Surname', 'surname'],
  ['Other Names', 'otherNames'],
  ['Email', 'email'],
  ['Date of Birth', 'dob'],
  ['Gender', 'gender'],
  ['Phone', 'phone'],
  ['Residential Address', 'address'],
  ['City', 'city'],
  ['State', 'state'],
  ['Postal Code', 'zip'],
  ['Country', 'country'],
  ['Occupation', 'occupation'],
  ['Annual Turnover', 'annualTurnover'],
  ['Tax ID', 'taxId'],
  ['Office Address', 'officeAddress'],
  ['Landmark / Nearest Bus Stop', 'landmark'],
]

const accountRows = [
  ['Username', 'username'],
  ['Means of ID', 'idType'],
  ['ID Card Number', 'idNumber'],
  ['Branch', 'branch'],
  ['Swift / Routing Number', 'swiftCode'],
  ['Account Type', 'accountType'],
  ['Account Number', 'accountNumber'],
  ['Security Question', 'securityQuestion'],
  ['Security Answer', 'securityAnswer'],
]

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-4 border-t border-text-secondary/10 px-4 py-3 first:border-t-0">
      <dt className="font-body text-sm text-text-secondary">{label}</dt>
      <dd className="font-body text-sm text-text-primary">{value || '—'}</dd>
    </div>
  )
}

function LedgerForm({ uid, type, balance, currency, onCancel, onSuccess }) {
  const isCredit = type === 'credit'
  const [form, setForm] = useState({
    amount: '',
    narration: '',
    date: new Date().toISOString().slice(0, 10),
  })
  const [submitting, setSubmitting] = useState(false)

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const amount = Number(form.amount)

    if (!amount || amount <= 0) {
      notifyError(null, 'Enter a valid amount greater than 0.')
      return
    }
    if (!form.narration.trim()) {
      notifyError(null, 'Narration is required.')
      return
    }
    if (!isCredit && amount > balance) {
      notifyError(null, 'Debit amount exceeds the current balance.')
      return
    }

    setSubmitting(true)
    try {
      const applyEntry = isCredit ? creditCustomer : debitCustomer
      const nextBalance = await applyEntry(uid, {
        amount,
        narration: form.narration.trim(),
        date: form.date,
      })
      notifySuccess(`${isCredit ? 'Credit' : 'Debit'} applied successfully.`)
      onSuccess(nextBalance)
    } catch (err) {
      notifyError(err, `Could not apply this ${type}.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
      <Input
        label="Amount*"
        id="ledger-amount"
        type="number"
        min="0.01"
        step="0.01"
        required
        value={form.amount}
        onChange={updateField('amount')}
        hint={`Current balance: ${currency} ${formatCurrency(balance)}`}
      />
      <Input
        label="Narration*"
        id="ledger-narration"
        required
        value={form.narration}
        onChange={updateField('narration')}
      />
      <Input
        label="Transaction Date*"
        id="ledger-date"
        type="date"
        required
        value={form.date}
        onChange={updateField('date')}
      />
      <div className="flex gap-3">
        <Button type="submit" loading={submitting} className="flex-1">
          Submit
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}

function CustomerProfile() {
  const { uid } = useParams()
  const [customer, setCustomer] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeAction, setActiveAction] = useState(null)

  useEffect(() => {
    let cancelled = false

    getUserProfile(uid)
      .then((profile) => {
        if (cancelled) return
        if (!profile) {
          setStatus('not-found')
          return
        }
        setCustomer(profile)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/dashboard/admin/customers" className="font-body text-sm font-medium text-primary hover:underline">
          ← Back to all customers
        </Link>
        {status === 'ready' && customer && (
          <Button to={`/dashboard/admin/customers/${uid}/edit`} size="sm" variant="secondary">
            Edit customer
          </Button>
        )}
      </div>

      {status === 'loading' && (
        <div className="mt-6">
          <LoadingScreen label="Loading customer…" />
        </div>
      )}

      {status === 'not-found' && (
        <Text variant="small" className="mt-6">
          No customer found for this account.
        </Text>
      )}

      {status === 'error' && (
        <Text variant="small" role="alert" className="mt-6 text-primary">
          Could not load this customer. Please try again.
        </Text>
      )}

      {status === 'ready' && customer && (
        <>
          <div className="mt-6 overflow-hidden rounded-lg border border-text-secondary/15">
            <div className="bg-text-primary px-6 py-8 text-text-on-primary">
              <p className="font-heading text-xl font-semibold">{customer.name || '—'}</p>
              <Text variant="small" className="mt-1 text-text-on-primary/70">
                {customer.accountType || 'Personal Account'}
              </Text>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-body text-xs">
                  <span
                    className={`h-2 w-2 rounded-full ${customer.status === 'active' ? 'bg-primary' : 'bg-text-on-primary/40'}`}
                    aria-hidden="true"
                  />
                  <span className="text-text-on-primary/70">Status:</span>
                  <span className="font-medium capitalize">{customer.status || 'unknown'}</span>
                </span>
                <span className="font-body text-xs text-text-on-primary/70">
                  Member since: <span className="font-medium text-text-on-primary">{customer.memberSince || '—'}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface px-6 py-4">
              <Text variant="small">Account balance</Text>
              <p className="font-heading text-lg font-semibold text-text-primary">
                {customer.currency || 'USD'} {formatCurrency(customer.balance)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-text-secondary/15 bg-surface px-6 py-4">
              <Button size="sm" onClick={() => setActiveAction('credit')}>
                Credit
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setActiveAction('debit')}>
                Debit
              </Button>
              <Button size="sm" variant="ghost" to={`/dashboard/admin/customers/${uid}/statement`}>
                Statement
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <Heading level={2} size="sm">
                Personal Information
              </Heading>
              <dl className="mt-3 overflow-hidden rounded-lg border border-text-secondary/15">
                {personalRows.map(([label, key]) => (
                  <DetailRow key={key} label={label} value={customer[key]} />
                ))}
              </dl>
            </div>

            <div>
              <Heading level={2} size="sm">
                Account Information
              </Heading>
              <dl className="mt-3 overflow-hidden rounded-lg border border-text-secondary/15">
                {accountRows.map(([label, key]) => (
                  <DetailRow key={key} label={label} value={customer[key]} />
                ))}
              </dl>
            </div>
          </div>

          <Modal
            open={Boolean(activeAction)}
            onClose={() => setActiveAction(null)}
            title={activeAction === 'credit' ? 'Credit Customer' : 'Debit Customer'}
          >
            {activeAction && (
              <LedgerForm
                uid={uid}
                type={activeAction}
                balance={Number(customer.balance) || 0}
                currency={customer.currency || 'USD'}
                onCancel={() => setActiveAction(null)}
                onSuccess={(nextBalance) => {
                  setCustomer((prev) => ({ ...prev, balance: nextBalance }))
                  setActiveAction(null)
                }}
              />
            )}
          </Modal>
        </>
      )}
    </div>
  )
}

export default CustomerProfile
