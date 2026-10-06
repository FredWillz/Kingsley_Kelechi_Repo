import Logo from '../components/Logo.jsx'
import Heading from '../components/ui/Heading.jsx'
import Text from '../components/ui/Text.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'

function CompassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  )
}

function ErrorPage() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-16 text-center text-text-primary">
      <Logo className="h-9" />

      <span className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CompassIcon />
      </span>

      <Heading level={1} size="lg" className="mt-6">
        We can&apos;t find that page
      </Heading>
      <Text variant="body" className="mt-3 max-w-md">
        It may have moved, or it's part of HSBC that's still being built. Either way, you haven't done
        anything wrong, let's get you back on track.
      </Text>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button to={user ? '/dashboard' : '/'} size="lg">
          {user ? 'Back to dashboard' : 'Back to home'}
        </Button>
        {!user && (
          <Button to="/login" variant="secondary" size="lg">
            Log in
          </Button>
        )}
      </div>
    </main>
  )
}

export default ErrorPage
