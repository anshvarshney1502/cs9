# Dashboard

Main admin dashboard — platform metrics, traffic chart, escalation/approval metrics,
SLA + community charts, resolver activity feed, and flag attention table.

Lazy-loaded in `AdminHome` (`React.lazy`) to defer the Recharts bundle from the
initial load.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `dashboardData` | `object\|null` | Fetched from `GET /api/admin/dashboard`. Shape: `{ metrics, recent, charts }` |
| `isLoading` | `boolean` | Controls the Refresh button spinner |
| `onRefresh` | `fn` | Re-fetches dashboard data (calls `fetchAdminDashboard`) |
| `searchQuery` | `string` | (Accepted but not used in this view) |
| `onOpenQuery` | `fn` | Opens a question in `QueryDetail` view (`currentAdminView='queryDetail'`) |

## Data Shape

```ts
{
  metrics: {
    questions:    { community: number, faq: number, total: number },
    answers:      { total: number },
    seekApproval: { total: number },    // questions with approval_status = 'pending'
    approvedCount: { total: number },   // questions with approval_status = 'approved'
    flags:        { open: number },
    users:        { total: number, thisWeek: number, thisMonth: number },
    sparks:       { total: number },
  },
  recent: {
    questions: Question[],
    users:     User[],
    flags:     Flag[],
    unresolved: Question[],              // open questions with low answer counts
  },
  charts: {
    traffic:          Array<{ hour: string, answers: number, comments: number }>,
    categories:       Array<{ category: string, new: number, resolved: number }>,
    resolutionSpeed:  Array<{ name: string, count: number }>,  // SLA buckets: <1h, 1-4h, 4-24h, >24h
    supportLoad:      Array<{ name: string, value: number }>,  // answers by author_role
  }
}
```

## Sub-components

### `MetricCard`

Displays a single KPI tile (icon, value, trend).

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Label (uppercase, tracking-wide) |
| `value` | `string\|number` | Formatted large number |
| `Icon` | `lucide icon` | Icon component rendered inside colored box |
| `iconClassName` | `string` | Background + text color classes |
| `trend` | `string` | Secondary metric shown below value |
| `trendType` | `'up'\|'down'` | Green for up, red for down |
| `badge` | `string` | Overrides trend — shown instead (e.g. `APPROVAL PENDING`) |
| `onClick` | `fn` | Optional click handler (e.g. navigate to filtered queries) |

### `ActivityItem`

Single activity feed row with colored icon, title, and metadata.

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `lucide icon` | Left-side icon |
| `title` | `string` | Bold row title |
| `meta` | `string` | Secondary metadata below title |
| `tone` | `'blue'\|'amber'\|'red'\|'neutral'\|'green'` | Controls icon background color |

## Layout Sections

1. **KPI strip** — 7 `MetricCard` tiles: Community Queries, FAQ Entries, Answers,
   Approval Pending, Approval Received, Open Flags, Spark Ledger
2. **Traffic chart** — Recharts `AreaChart` (answers + comments combined) over 24h.
   Falls back to `PLACEHOLDER_TRAFFIC` if `charts.traffic` is absent.
3. **Resolution Speed chart** — Recharts `BarChart` (SLA buckets: `<1h`, `1-4h`,
   `4-24h`, `>24h`). Clicking a bar navigates to filtered Queries Management.
4. **Community Independence chart** — Recharts `PieChart` (answers grouped by
   `author_role`: ADMIN / RESOLVER / USER).
5. **Needs Attention table** — first 5 open flags; rows link to the flag in
   FlagModeration via `onNavigate('flagModeration')`.
6. **Unresolved Queries table** — open community questions with low answers;
   rows are clickable (`onOpenQuery`) to open in QueryDetail.
7. **Bottom metrics** — Users total, New this week, New this month (3-column strip).

## Refresh

`onRefresh` is called on the Refresh button click. `isLoading` disables the button
and spins the icon.