import { useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import Button from '../../../../components/Button/Button'
import Select from '../../../../components/Select/Select'

const REASONS = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'incorrect',     label: 'Incorrect information' },
  { value: 'spam',          label: 'Spam' },
  { value: 'other',         label: 'Other' },
]

function ReportModal({ open, onClose, onSubmit, submitting }) {
  const [reason, setReason]   = useState('')
  const [details, setDetails] = useState('')

  function handleSubmit() {
    onSubmit({ reason, description: details })
  }

  return (
    <Modal isOpen={open} onClose={onClose} position="center" title="Report Content">
      {/* Reason dropdown */}
      <Select
        options={REASONS}
        value={reason}
        onChange={setReason}
        placeholder="Select a reason"
        className="mb-4"
      />

      {/* Details textbox */}
      <textarea
        value={details}
        onChange={e => setDetails(e.target.value)}
        placeholder="Additional details (optional)…"
        className="mb-6 h-20 w-full resize-none rounded-lg border border-[#d1d5db] bg-white p-3 text-[13px] text-[#191c1d] outline-none transition placeholder:text-[#9da1a1] focus:border-[#8c6a40] focus:ring-1 focus:ring-[#8c6a40]/15"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={onClose} className="text-[13px]">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-red-600 text-[13px] hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send Report'}
        </Button>
      </div>
    </Modal>
  )
}

export default ReportModal
