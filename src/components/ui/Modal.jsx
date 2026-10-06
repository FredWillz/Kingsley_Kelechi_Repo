import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Heading from './Heading.jsx'

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-text-primary/50" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg"
      >
        {title && (
          <Heading level={2} size="sm" className="mb-4">
            {title}
          </Heading>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
