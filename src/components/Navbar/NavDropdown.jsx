import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from './icons.jsx'

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const firstItemRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) firstItemRef.current?.focus()
  }, [open])

  function handleTriggerKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleBlur(event) {
    if (containerRef.current && !containerRef.current.contains(event.relatedTarget)) {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center gap-1 rounded-sm px-1 py-1 font-body text-sm font-medium text-text-primary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {label}
        <ChevronDownIcon className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full z-20 mt-2 w-56 animate-fade-in rounded-md border border-text-secondary/20 bg-surface py-2 shadow-lg"
        >
          {items.map((item, index) => (
            <li key={item.to} role="none">
              <Link
                to={item.to}
                role="menuitem"
                ref={index === 0 ? firstItemRef : undefined}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 font-body text-sm text-text-primary hover:bg-background focus-visible:bg-background focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NavDropdown
