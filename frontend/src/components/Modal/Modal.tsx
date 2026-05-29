import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  children?: ReactNode
  isOpen: boolean
  onClose: () => void
  panelClassName?: string
  title?: string
  /** 'center' (default) or 'top-right' for dropdown-style panels */
  position?: 'center' | 'top-right'
}

function Modal({
  children,
  isOpen,
  onClose,
  panelClassName = '',
  title = 'Dialog',
  position = 'center',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || position === 'top-right') return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, position])

  if (!isOpen) {
    return null
  }

  if (position === 'top-right') {
    return (
      <div
        aria-label={title}
        aria-modal="true"
        className="fixed right-6 top-20 z-[1000] w-full max-w-sm rounded-lg bg-white pt-10 pb-6 px-6 shadow-2xl ring-1 ring-black/5"
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </button>
        {children}
      </div>
    )
  }

  return (
    <div
      aria-label={title}
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10 px-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`relative w-full max-w-[440px] rounded-lg bg-white p-8 shadow-2xl sm:p-12 ${panelClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close dialog"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
