import { useState } from 'react'
import { toast } from 'react-toastify'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Input from '../../../components/ui/Input.jsx'
import Button from '../../../components/ui/Button.jsx'
import SelectField from '../../../components/ui/SelectField.jsx'
import ProfilePictureUpload from '../../../components/ui/ProfilePictureUpload.jsx'
import { adminCreateUser } from '../../../lib/adminCreateUser.js'
import { generateAccountNumber } from '../../../lib/accountNumber.js'
import { notifyError } from '../../../lib/toast.js'
import {createBackendUser} from "../../../lib/apiClient.js"

const initialForm = {
  surname: '',
  otherNames: '',
  email: '',
  dob: '',
  gender: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  idType: '',
  idNumber: '',
  occupation: '',
  annualTurnover: '',
  taxId: '',
  officeAddress: '',
  landmark: '',
  securityQuestion: '',
  securityAnswer: '',
  branch: '',
  swiftCode: '',
  accountType: '',
  initialDeposit: '',
  currency: '',
  username: '',
  password: '',
  repeatPassword: '',
  profilePictureUrl: '',
  agree: false,
}

function AddCustomer() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (form.password !== form.repeatPassword) {
      toast.error('Password and Repeat Password do not match.')
      return
    }
    if (!form.agree) {
      toast.error('You must agree to the declaration before submitting.')
      return
    }

    setStatus('submitting')
    try {
      await adminCreateUser({
        email: form.email,
        password: form.password,
        profile: {
          name: `${form.surname} ${form.otherNames}`.trim(),
          surname: form.surname,
          otherNames: form.otherNames,
          dob: form.dob,
          gender: form.gender,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          idType: form.idType,
          idNumber: form.idNumber,
          occupation: form.occupation,
          annualTurnover: form.annualTurnover,
          taxId: form.taxId,
          officeAddress: form.officeAddress,
          landmark: form.landmark,
          securityQuestion: form.securityQuestion,
          securityAnswer: form.securityAnswer,
          branch: form.branch,
          swiftCode: form.swiftCode,
          username: form.username,
          role: 'user',
          accountType: form.accountType,
          currency: form.currency,
          balance: Number(form.initialDeposit) || 0,
          accountNumber: generateAccountNumber(),
          memberSince: new Date().toISOString().slice(0, 10),
          profilePictureUrl: form.profilePictureUrl,
          status: 'active',
        },
      })
      setStatus('success')
      setForm(initialForm)
      createBackendUser(initialForm)
    } catch (err) {
      setStatus('error')
      notifyError(err, 'Could not create the customer.')
    }
  }

  return (
    <div className="max-w-4xl">
      <Heading level={1} size="md">
        Add Customer
      </Heading>
      <Text variant="body" className="mt-2">
        Open a new customer account. They can sign in immediately with the email and password you set here.
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
            <Input
              label="Email*"
              id="email"
              type="email"
              required
              autoComplete="off"
              value={form.email}
              onChange={updateField('email')}
            />
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
              label="Initial Deposit*"
              id="initialDeposit"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.initialDeposit}
              onChange={updateField('initialDeposit')}
            />
            <SelectField
              label="Currency*"
              id="currency"
              required
              value={form.currency}
              onChange={updateField('currency')}
              options={['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']}
            />
            <Input
              label="Username*"
              id="username"
              required
              value={form.username}
              onChange={updateField('username')}
            />
            <Input
              label="Password*"
              id="password"
              type="text"
              required
              value={form.password}
              onChange={updateField('password')}
              hint="This is also used to sign in, alongside the email above."
            />
            <Input
              label="Repeat Password*"
              id="repeatPassword"
              type="text"
              required
              value={form.repeatPassword}
              onChange={updateField('repeatPassword')}
            />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-text-secondary/10 pt-8">
          <Heading level={2} size="sm">
            4. Profile Picture (Optional)
          </Heading>
          <Text variant="small" className="text-text-secondary">
            Upload a profile picture for this customer. This will be displayed on their profile. Leave empty to skip.
          </Text>
          <div className="rounded-lg border border-text-secondary/15 bg-surface p-5">
            <ProfilePictureUpload
              userId={form.email}
              currentImageUrl={form.profilePictureUrl}
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, profilePictureUrl: url }))}
            />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-t border-text-secondary/10 pt-8">
          <div className="flex flex-col gap-4 rounded-lg border border-text-secondary/15 bg-surface p-5">
            <Heading level={2} size="sm">
              Declaration
            </Heading>
            <Text variant="small">I hereby declare that all information provided above is true and updated.</Text>
            <Text variant="small">
              I am also aware that if found guilty of information falsification, the bank reserves the right to
              freeze this account and report it to the necessary authority.
            </Text>
            <label className="flex items-center gap-2 font-body text-sm text-text-primary">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(event) => setForm((prev) => ({ ...prev, agree: event.target.checked }))}
                className="h-4 w-4 rounded accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              I Agree
            </label>
          </div>
        </section>

        {status === 'success' && (
          <Text variant="small" role="status" className="text-primary">
            Customer account created successfully.
          </Text>
        )}

        <Button type="submit" loading={status === 'submitting'} className="self-start">
          Submit
        </Button>
      </form>
    </div>
  )
}

export default AddCustomer
