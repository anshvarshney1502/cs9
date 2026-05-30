import { useEffect, useState } from 'react'
import { Zap, TrendingUp } from 'lucide-react'
import { fetchLeaderboard } from '../../../user/service'

const SPARK_ICONS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

function SparkLeaderboardView() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('today') // 'today' | 'monthly'

  useEffect(() => {
    setLoading(true)
    fetchLeaderboard({ type: 'spark', limit: 20 })
      .then(data => setLeaders(data))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false))
  }, [timeFilter])

  return (
    <div className="flex-1 overflow-y-auto p-5 lg:p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fffbeb]">
            <Zap className="h-5 w-5 text-amber-500" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display text-[24px] font-semibold text-[#111827]">Spark Leaderboard</h1>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-[#4b5563]">
          Recognising academic rigour and community contribution. Ranked by spark points earned through helpful answers, accepted solutions, and peer support.
        </p>
      </div>

      {/* Metric strip */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6b7280]">Total Sparks Issued</p>
          <p className="mt-2 text-[28px] font-semibold text-[#111827]">
            {leaders.reduce((sum, l) => sum + (l.score || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6b7280]">Top Earners Today</p>
          <p className="mt-2 text-[28px] font-semibold text-[#111827]">
            {leaders.slice(0, 3).reduce((sum, l) => sum + (l.score || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#6b7280]">Active Learners</p>
            <TrendingUp className="h-4 w-4 text-emerald-500" strokeWidth={1.8} />
          </div>
          <p className="mt-2 text-[28px] font-semibold text-[#111827]">{leaders.length}</p>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#111827]">Top Contributors</h2>
          <div className="flex gap-2 rounded-lg bg-[#f3f4f6] p-1">
            {['Monthly', 'Today'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setTimeFilter(f.toLowerCase())}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition ${
                  timeFilter === f.toLowerCase()
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-[13px] text-[#747878]">
            Loading leaderboard…
          </div>
        ) : leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[13px] text-[#747878]">
            <Zap className="mb-2 h-8 w-8 text-[#d1d5db]" strokeWidth={1.5} />
            No spark data yet. Sparks are earned when users answer questions and receive upvotes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#6b7280]">
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Scholar</th>
                  <th className="px-5 py-3">Questions Answered</th>
                  <th className="px-5 py-3">Upvotes Received</th>
                  <th className="px-5 py-3">Spark Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {leaders.map((leader, index) => {
                  const medal = SPARK_ICONS[index + 1]
                  return (
                    <tr
                      key={leader.userId || index}
                      className="hover:bg-[#fafafa] transition"
                    >
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1">
                          {medal ? (
                            <span className="text-[16px]">{medal}</span>
                          ) : (
                            <span className="w-5 text-center font-display text-[18px] font-bold text-[#6b7280]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8c6a40] text-[11px] font-bold text-white">
                            {(leader.displayName || leader.name || 'U')
                              .trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#111827]">
                              {leader.displayName || leader.name || 'Unknown'}
                            </p>
                            <p className="text-[11px] text-[#9ca3af]">{leader.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#374151]">
                        {leader.answersCount ?? leader.resolved ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-[#374151]">
                        {leader.upvotesReceived ?? leader.upvotes ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-amber-700">
                          ⚡ {leader.score?.toLocaleString('en-IN') ?? leader.sparkBalance?.toLocaleString('en-IN') ?? 0}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SparkLeaderboardView