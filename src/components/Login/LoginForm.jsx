import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Text from '../ui/Text.jsx'
import { ShieldIcon } from '../Trust/icons.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { isFirebaseConfigured } from '../../lib/firebase.js'
import { notifyError } from '../../lib/toast.js'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const canContinue = email.trim() !== '' && password.trim() !== '' && !submitting

  // Navigate once the profile has actually loaded into context, rather than as soon as
  // the sign-in call resolves — the Firestore profile fetch inside AuthProvider is async,
  // so racing straight to /dashboard can hit RequireAuth before `user` is populated.
  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      notifyError(
        err,
        isFirebaseConfigured
          ? 'Incorrect email or password. Please try again.'
          : "Firebase isn't configured yet. Add your project keys to .env and restart the dev server.",
      )
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Text variant="small" className="mb-4">
        Please complete the fields below.
      </Text>

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <div className="mt-5">
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <label className="mt-5 flex items-center gap-2 font-body text-sm text-text-primary">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="h-4 w-4 rounded accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        Remember my email
      </label>

      <div className="mt-6 flex items-center gap-2">
        <ShieldIcon className="h-5 w-5 shrink-0 text-primary" />
        <Text variant="small">Eligible deposits are insured up to $250,000 per depositor.</Text>
      </div>

      <Button type="submit" size="lg" loading={submitting} disabled={!canContinue} className="mt-6 w-full">
        Continue
      </Button>
    </form>
  )
}

export default LoginForm
