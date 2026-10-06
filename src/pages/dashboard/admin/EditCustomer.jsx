import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Input from '../../../components/ui/Input.jsx'
import Button from '../../../components/ui/Button.jsx'
import SelectField from '../../../components/ui/SelectField.jsx'
import LoadingScreen from '../../../components/ui/LoadingScreen.jsx'
import ProfilePictureUpload from '../../../components/ui/ProfilePictureUpload.jsx'
import { getUserProfile, updateUserProfile } from '../../../lib/userProfile.js'
import { notifyError } from '../../../lib/toast.js'

const editableFields = [
  'surname',
  'otherNames',
  'dob',
  'gender',
  'phone',
  'address',
  'city',
  'state',
  'zip',
  'country',
  'idType',
  'idNumber',
  'occupation',
  'annualTurnover',
  'taxId',
  'officeAddress',
  'landmark',
  'securityQuestion',
  'securityAnswer',
  'branch',
  'swiftCode',
  'accountType',
  'currency',
  'balance',
  'username',
  'profilePictureUrl',
  'status',
]

function EditCustomer() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [readOnly, setReadOnly] = useState({ email: '', accountNumber: '', memberSince: '' })
  const [loadStatus, setLoadStatus] = useState('loading')
  const [saveStatus, setSaveStatus] = useState('idle')

  useEffect(() => {
    let cancelled = false

    getUserProfile(uid)
      .then((profile) => {
        if (cancelled) return
        if (!profile) {
          setLoadStatus('not-found')
          return
        }
        const nextForm = {}
        editableFields.forEach((field) => {
          nextForm[field] = profile[field] ?? ''
        })
        setForm(nextForm)
        setReadOnly({
          email: profile.email || '',
          accountNumber: profile.accountNumber || '',
          memberSince: profile.memberSince || '',
        })
        setLoadStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setLoadStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaveStatus('saving')
    try {
      await updateUserProfile(uid, {
        ...form,
        balance: Number(form.balance) || 0,
        name: `${form.surname} ${form.otherNames}`.trim(),
      })
      setSaveStatus('success')
      setTimeout(() => navigate(`/dashboard/admin/customers/${uid}`), 1000)
    } catch (err) {
      setSaveStatus('error')
      notifyError(err, 'Could not save these changes.')
    }
  }

  if (loadStatus === 'loading') {
    return <LoadingScreen label="Loading customer…" />
  }

  if (loadStatus === 'not-found') {
    return (
      <div>
        <Link to="/dashboard/admin/customers" className="font-body text-sm font-medium text-primary hover:underline">
          ← Back to all customers
        </Link>
        <Text variant="small" className="mt-6">
          No customer found for this account.
        </Text>
      </div>
    )
  }

  if (loadStatus === 'error') {
    return (
      <div>
        <Link to="/dashboard/admin/customers" className="font-body text-sm font-medium text-primary hover:underline">
          ← Back to all customers
        </Link>
        <Text variant="small" role="alert" className="mt-6 text-primary">
          Could not load this customer. Please try again.
        </Text>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <Link
        to={`/dashboard/admin/customers/${uid}`}
        className="font-body text-sm font-medium text-primary hover:underline"
      >
        ← Back to customer profile
      </Link>

      <Heading level={1} size="md" className="mt-4">
        Edit Customer
      </Heading>
      <Text variant="body" className="mt-2">
        Update this customer's details. Changes save directly to their account.
      </Text>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-10">
        <section className="flex flex-col gap-5">
          <Heading level={2} size="sm">
            1. Personal Information
          </Heading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Surname*" id="surname" required value={form.surname} onChange={updateField('surname')} />
            <Input
              label="Other Names*"
              id="otherNames"
              required
              value={form.otherNames}
              onChange={updateField('otherNames')}
            />
            <Input label="Email" id="email" value={readOnly.email} disabled hint="Email can't be changed here" />
            <Input
              label="Date of Birth*"
              id="dob"
              type="date"
              required
              value={form.dob}
              onChange={updateField('dob')}
            />
            <SelectField
              label="Gender*"
              id="gender"
              required
              value={form.gender}
              onChange={updateField('gender')}
              options={['Male', 'Female', 'Other']}
            />
            <Input label="Phone Number*" id="phone" required value={form.phone} onChange={updateField('phone')} />
            <Input
              label="Residential Address*"
              id="address"
              required
              value={form.address}
              onChange={updateField('address')}
            />
            <Input label="City" id="city" value={form.city} onChange={updateField('city')} />
            <Input label="State*" id="state" required value={form.state} onChange={updateField('state')} />
            <Input label="Postal Code*" id="zip" required value={form.zip} onChange={updateField('zip')} />
            <Input label="Country*" id="country" required value={form.country} onChange={updateField('country')} />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-text-secondary/10 pt-8">
          <Heading level={2} size="sm">
            2. Identification &amp; Know Your Customer
          </Heading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              label="ID Card*"
              id="idType"
              required
              value={form.idType}
              onChange={updateField('idType')}
              options={['National ID Card', 'International Passport', "Driver's License", "Voter's Card"]}
            />
            <Input
              label="ID Card Number*"
              id="idNumber"
              required
              value={form.idNumber}
              onChange={updateField('idNumber')}
            />
            <Input label="Occupation" id="occupation" value={form.occupation} onChange={updateField('occupation')} />
            <Input label="Tax ID" id="taxId" value={form.taxId} onChange={updateField('taxId')} />
            <Input
              label="Office Address"
              id="officeAddress"
              value={form.officeAddress}
              onChange={updateField('officeAddress')}
            />
            <Input
              label="Landmark / Nearest Bus Stop"
              id="landmark"
              value={form.landmark}
              onChange={updateField('landmark')}
            />
            <Input
              label="Security Question"
              id="securityQuestion"
              value={form.securityQuestion}
              onChange={updateField('securityQuestion')}
            />
            <Input
              label="Security Answer"
              id="securityAnswer"
              value={form.securityAnswer}
              onChange={updateField('securityAnswer')}
            />
            <Input
              label="Annual Turnover"
              id="annualTurnover"
              value={form.annualTurnover}
              onChange={updateField('annualTurnover')}
              hint="In the account's selected currency"
            />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-text-secondary/10 pt-8">
          <Heading level={2} size="sm">
            3. Account Information
          </Heading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              label="Branch*"
              id="branch"
              required
              value={form.branch}
              onChange={updateField('branch')}
              options={['Main Branch', 'City Centre Branch', 'Online Branch']}
            />
            <Input
              label="Swift / Routing Number"
              id="swiftCode"
              value={form.swiftCode}
              onChange={updateField('swiftCode')}
            />
            <SelectField
              label="Account Type*"
              id="accountType"
              required
              value={form.accountType}
              onChange={updateField('accountType')}
              options={['Savings Account', 'Current Account', 'Business Account']}
            />
            <Input
              label="Balance*"
              id="balance"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.balance}
              onChange={updateField('balance')}
            />
            <SelectField
              label="Currency*"
              id="currency"
              required
              value={form.currency}
              onChange={updateField('currency')}
              options={['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']}
            />
            <SelectField
              label="Account Status*"
              id="status"
              required
              value={form.status}
              onChange={updateField('status')}
              options={['active', 'suspended']}
            />
            <Input label="Username*" id="username" required value={form.username} onChange={updateField('username')} />
            <Input label="Account Number" id="accountNumber" value={readOnly.accountNumber} disabled />
            <Input label="Member Since" id="memberSince" value={readOnly.memberSince} disabled />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-text-secondary/10 pt-8">
          <Heading level={2} size="sm">
            4. Profile Picture (Optional)
          </Heading>
          <Text variant="small" className="text-text-secondary">
            Update the customer's profile picture. Leave empty to keep existing picture.
          </Text>
          <div className="rounded-lg border border-text-secondary/15 bg-surface p-5">
            <ProfilePictureUpload
              userId={uid}
              currentImageUrl={form.profilePictureUrl}
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, profilePictureUrl: url }))}
            />
          </div>
        </section>

        {saveStatus === 'success' && (
          <Text variant="small" role="status" className="text-primary">
            Changes saved. Returning to profile…
          </Text>
        )}

        <Button type="submit" loading={saveStatus === 'saving'} className="self-start">
          Save changes
        </Button>
      </form>
    </div>
  )
}

export default EditCustomer
