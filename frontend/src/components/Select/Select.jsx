import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Styled dropdown/select component.
 *
 * Props:
 *   options  — Array<{ value: string, label: string }>
 *   value    — currently selected value (string)
 *   onChange — (value: string) => void
 *   placeholder — string (default: 'Select an option')
 *   className — optional extra classes for the trigger button
 */
function Select({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-4 text-[13px] transition focus:outline-none ${
          isOpen
            ? 'border-[#8c6a40] ring-1 ring-[#8c6a40]/15'
            : 'border-[#d1d5db] focus:border-black focus:ring-1 focus:ring-black'
        } ${selected ? 'text-[#191c1d]' : 'text-[#9da1a1]'}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[#d1d5db] bg-white py-1 shadow-lg">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] transition ${
                  opt.value === value
                    ? 'bg-[#8c6a40]/5 text-[#8c6a40]'
                    : 'text-[#444748] hover:bg-[#f3f4f6]'
                }`}
              >
                {opt.label}
                {opt.value === value && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
