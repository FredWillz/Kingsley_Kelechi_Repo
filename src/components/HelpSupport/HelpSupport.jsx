import { Link } from 'react-router-dom'
import Heading from '../ui/Heading.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'
import { helpColumns } from './helpLinks.js'
import { ChevronRightIcon } from './icons.jsx'

function HelpSupport() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section ref={elementRef} aria-labelledby="help-support-heading" className={`bg-surface ${revealClassName}`}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Heading level={2} id="help-support-heading">
          Help and support
        </Heading>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {helpColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-heading text-base font-semibold text-text-primary">{column.heading}</p>
              <ul className="mt-4 space-y-3 border-t border-text-secondary/15 pt-4">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-1 rounded-sm font-body text-sm text-text-primary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.label}
                      <ChevronRightIcon className="text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HelpSupport
