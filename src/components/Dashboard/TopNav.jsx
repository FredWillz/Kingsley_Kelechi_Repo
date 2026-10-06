import Logo from '../Logo.jsx'
import { MenuIcon } from '../Navbar/icons.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { formatCurrency } from '../../lib/format.js'

function TopNav({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between gap-4 border-b border-text-secondary/15 bg-surface px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-sm p-1 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <MenuIcon />
        </button>
        <Logo />
      </div>

      {user?.role === 'admin' ? (
        <p className="font-heading text-sm font-semibold text-text-primary">Administrator Console</p>
      ) : (
        <div className="text-right">
          <p className="font-heading text-sm font-semibold text-text-primary">{user?.accountType}</p>
          <p className="font-body text-xs text-text-secondary">
            Balance:{' '}
            <span className="font-semibold text-primary">
              {user?.currency || 'USD'} {formatCurrency(user?.balance)}
            </span>
          </p>
        </div>
      )}
    </header>
  )
}

export default TopNav
