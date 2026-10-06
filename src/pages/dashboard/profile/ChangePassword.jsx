import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Input from '../../../components/ui/Input.jsx'
import Button from '../../../components/ui/Button.jsx'
import { auth } from '../../../lib/firebase.js'
import { notifyError, notifySuccess } from '../../../lib/toast.js'

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (newPassword.length < 6) {
      notifyError(null, 'New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      notifyError(null, 'New password and confirmation do not match.')
      return
    }

    setSubmitting(true)
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
      notifySuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      notifyError(err, 'Could not update your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md">
      <Heading level={1} size="md">
        Change Password
      </Heading>
      <Text variant="body" className="mt-2">
        Choose a strong password you don't use anywhere else.
      </Text>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <Input
          label="Current password"
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <Input
          label="New password"
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          hint="At least 6 characters."
          required
        />
        <Input
          label="Confirm new password"
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <Button type="submit" loading={submitting} className="mt-2 self-start">
          Update password
        </Button>
      </form>
    </div>
  )
}

export default ChangePassword
