import { useEffect, useState } from 'react'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Input from '../../../components/ui/Input.jsx'
import Button from '../../../components/ui/Button.jsx'
import LoadingScreen from '../../../components/ui/LoadingScreen.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import { UserPlusIcon } from '../../../components/Dashboard/icons.jsx'
import { useAuth } from '../../../hooks/useAuth.js'
import { addBeneficiary, listBeneficiaries } from '../../../lib/beneficiaries.js'
import { notifyError } from '../../../lib/toast.js'

const initialForm = {
  name: '',
  nickname: '',
  bankName: '',
  accountNumber: '',
  relationship: '',
}

const relationshipOptions = ['Family', 'Friend', 'Business', 'Other']

function AddBeneficiary() {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [beneficiaries, setBeneficiaries] = useState(null)
  const [listError, setListError] = useState('')

  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false

    listBeneficiaries(user.uid)
      .then((result) => {
        if (!cancelled) setBeneficiaries(result)
      })
      .catch(() => {
        if (!cancelled) setListError('Could not load your beneficiaries. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [user?.uid])

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    try {
      await addBeneficiary(user.uid, form)
      setStatus('success')
      setBeneficiaries((prev) =>
        [...(prev || []), { id: `${Date.now()}`, ...form }].sort((a, b) => a.name.localeCompare(b.name)),
      )
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      notifyError(err, 'Could not add this beneficiary.')
    }
  }

  return (
    <div className="max-w-3xl">
      <Heading level={1} size="md">
        Add Beneficiary
      </Heading>
      <Text variant="body" className="mt-2">
        Save someone's account details once so you have them ready any time, without re-entering
        them.
      </Text>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 rounded-lg border border-text-secondary/15 bg-surface p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Beneficiary Full Name*"
            id="name"
            required
            value={form.name}
            onChange={updateField('name')}
          />
          <Input
            label="Nickname"
            id="nickname"
            value={form.nickname}
            onChange={updateField('nickname')}
            hint="How you'll recognize them in your list"
          />
          <Input
            label="Bank Name*"
            id="bankName"
            required
            value={form.bankName}
            onChange={updateField('bankName')}
          />
          <Input
            label="Account Number*"
            id="accountNumber"
            required
            value={form.accountNumber}
            onChange={updateField('accountNumber')}
          />
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="relationship" className="font-body text-sm font-medium text-text-primary">
              Relationship
            </label>
            <select
              id="relationship"
              value={form.relationship}
              onChange={updateField('relationship')}
              className="rounded-md border border-text-secondary/30 bg-background px-3 py-2 font-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select relationship</option>
              {relationshipOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {status === 'success' && (
          <Text variant="small" role="status" className="text-primary">
            Beneficiary added successfully.
          </Text>
        )}

        <Button type="submit" loading={status === 'submitting'} className="self-start">
          Add beneficiary
        </Button>
      </form>

      <div className="mt-10">
        <Heading level={2} size="sm">
          Your beneficiaries
        </Heading>

        {listError && (
          <Text variant="small" role="alert" className="mt-4 text-primary">
            {listError}
          </Text>
        )}

        {!listError && beneficiaries === null && (
          <div className="mt-4">
            <LoadingScreen label="Loading your beneficiaries…" />
          </div>
        )}

        {!listError && beneficiaries?.length === 0 && (
          <div className="mt-4">
            <EmptyState
              icon={UserPlusIcon}
              title="No beneficiaries yet"
              description="Add someone's account details above and they'll show up here for quick access next time."
            />
          </div>
        )}

        {!listError && beneficiaries && beneficiaries.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-text-secondary/15">
            <table className="w-full text-left">
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                    Bank
                  </th>
                  <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                    Account Number
                  </th>
                  <th scope="col" className="px-4 py-3 font-body text-xs font-semibold uppercase text-text-secondary">
                    Relationship
                  </th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="border-t border-text-secondary/10">
                    <td className="px-4 py-3 font-body text-sm font-medium text-text-primary">
                      {beneficiary.name}
                      {beneficiary.nickname && (
                        <span className="ml-1.5 font-normal text-text-secondary">({beneficiary.nickname})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-text-secondary">{beneficiary.bankName}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-secondary">{beneficiary.accountNumber}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-secondary">
                      {beneficiary.relationship || '—'}
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

export default AddBeneficiary
