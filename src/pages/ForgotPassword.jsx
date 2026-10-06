import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase.js'
import { notifyError } from '../lib/toast.js'
import Logo from '../components/Logo.jsx'
import Heading from '../components/ui/Heading.jsx'
import Text from '../components/ui/Text.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    try {
      await sendPasswordResetEmail(auth, email)
      setStatus('sent')
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Don't reveal whether an account exists for this email.
        setStatus('sent')
      } else {
        setStatus('idle')
        notifyError(err, 'Something went wrong. Please check the email address and try again.')
      }
    }
  }

  return (
    <div className="min-h-svh bg-background text-text-primary">
      <header className="border-b border-text-secondary/10 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
      </header>

      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Heading level={1} size="md">
          Reset your password
        </Heading>
        <Text variant="body" className="mt-2">
          Enter the email on your account and we'll send you a link to reset your password.
        </Text>

        {status === 'sent' ? (
          <Text variant="body" role="status" className="mt-6 text-primary">
            If an account exists for that email, a password reset link is on its way.
          </Text>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <Input
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Button type="submit" size="lg" loading={status === 'submitting'} disabled={!email.trim()}>
              Send reset link
            </Button>
          </form>
        )}

        <div className="mt-8 border-t border-text-secondary/10 pt-6">
          <Link to="/login" className="font-body text-sm font-medium text-primary hover:underline">
            Back to log in
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
