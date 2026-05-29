import { ChevronUp, MessageCircle, Reply, CheckCircle, Clock, Flag } from 'lucide-react'
import { STATUS_CONFIG } from '../../constants'
import { notifyError } from '../../../../lib/notify'

function QuestionCard({ query, onUpvote, onClick }) {
  const { color: statusColor } = STATUS_CONFIG[query.status] ?? STATUS_CONFIG.Active
  const StatusIcon = query.status === 'Active' ? CheckCircle
    : query.status === 'In Progress' ? Clock : CheckCircle
  const isResolved = query.status === 'Resolved'

  return (
    <div className="mb-4 flex rounded-xl border border-[#9ca3af] bg-white p-5">
      {/* Upvote */}
      <button
        type="button"
        onClick={() => onUpvote(query.id)}
        className="mr-5 flex h-[60px] min-w-[60px] flex-col items-center justify-center rounded-lg text-[18px] font-bold transition-all"
        style={{
          background: query.hasUpvoted ? '#8c6a40' : '#d1d5db',
          color:      query.hasUpvoted ? '#fff'    : '#111827',
        }}
      >
        <ChevronUp
          className="h-6 w-6"
          strokeWidth={2}
          style={{ color: query.hasUpvoted ? '#fff' : '#111827' }}
        />
        <span>{query.upvotes}</span>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {query.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded bg-black px-2 py-0.5 text-[10px] font-semibold capitalize text-white"
              >
                {tag.label}
              </span>
            ))}
          </div>
          <span className="shrink-0 text-[12px] font-medium text-[#6b7280]">
            <span className="text-[#191c1d]">{query.authorName}</span> · {query.meta}
          </span>
        </div>

        <h3 className="font-display mb-2 text-[18px] font-semibold text-[#191c1d]">{query.title}</h3>
        <p className="mb-4 text-[13px] leading-6 text-[#444748]" dangerouslySetInnerHTML={{ __html: query.desc }} />

        <div className="flex items-center gap-5 text-[12px] font-medium text-[#444748]">
          {/* Comments count — display only */}
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            {query.comments} {query.comments === 1 ? 'comment' : 'comments'}
          </span>

          {/* Reply / View — opens the replies view */}
          <button
            type="button"
            className="flex items-center gap-1.5 transition hover:text-[#8c6a40]"
            onClick={() => onClick?.(query.id)}
          >
            <Reply className="h-3.5 w-3.5" strokeWidth={1.8} />
            {isResolved ? 'View' : 'Reply'}
          </button>

          {/* Report — not yet supported */}
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] transition hover:text-red-500"
            onClick={() => notifyError("Report doesn't supported yet.")}
          >
            <Flag className="h-3 w-3" strokeWidth={1.8} />
            Report
          </button>

          <span className="flex items-center gap-1.5" style={{ color: statusColor }}>
            <StatusIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
            {query.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
