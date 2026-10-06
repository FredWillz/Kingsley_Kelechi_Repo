import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import Logo from '../Logo.jsx'
import NavDropdown from './NavDropdown.jsx'
import MobileMenu from './MobileMenu.jsx'
import { MenuIcon } from './icons.jsx'
import { navLinks } from './navLinks.js'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef(null)

  return (
    <header className="sticky top-0 z-30 border-b border-text-secondary/15 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.items ? (
              <NavDropdown key={link.label} label={link.label} items={link.items} />
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-sm px-1 py-1 font-body text-sm font-medium text-text-primary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:block">
          <Button to="/login" size="sm">
            Log in
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          aria-label="Open menu"
          className="rounded-sm p-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <MenuIcon />
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        triggerRef={menuButtonRef}
      />
    </header>
  )
}

export default Navbar
