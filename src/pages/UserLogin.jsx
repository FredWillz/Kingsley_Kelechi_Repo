import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Heading from '../components/ui/Heading.jsx'
import SecurityNotice from '../components/Login/SecurityNotice.jsx'
import LoginForm from '../components/Login/LoginForm.jsx'

function UserLogin() {
  return (
    <div className="min-h-svh bg-background text-text-primary">
      <header className="border-b border-text-secondary/10 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
      </header>

      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Heading level={1} size="md">
          Log on to online banking
        </Heading>

        <div className="mt-6">
          <SecurityNotice />
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-text-secondary/10 pt-6">
          {/* <Link to="/login/forgot-password" className="font-body text-sm font-medium text-primary hover:underline">
            Forgot your password?
          </Link> */}
          <Link to="/" className="font-body text-sm font-medium text-primary hover:underline">
            Not registered for online banking?
          </Link>
        </div>
      </main>
    </div>
  )
}

export default UserLogin
