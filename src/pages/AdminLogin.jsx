import Logo from '../components/Logo.jsx'
import Heading from '../components/ui/Heading.jsx'
import SecurityNotice from '../components/Login/SecurityNotice.jsx'
import LoginForm from '../components/Login/LoginForm.jsx'

function AdminLogin() {
  return (
    <div className="min-h-svh bg-background text-text-primary">
      <header className="border-b border-text-secondary/10 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
      </header>

      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Heading level={1} size="md">
          Administrator log in
        </Heading>

        <div className="mt-6">
          <SecurityNotice />
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}

export default AdminLogin
