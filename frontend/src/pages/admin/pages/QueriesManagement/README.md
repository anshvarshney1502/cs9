# Queries Management

Admin view for browsing **all** platform questions (every kind and status), with
server-side search and pagination. Each query renders as a detail-rich card.

- **Component:** [`index.jsx`](./index.jsx) — `QueriesManagementView`
- **Rendered by:** [`pages/admin/index.jsx`](../../index.jsx) when
  `currentAdminView === 'queriesManagement'`.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `searchQuery` | `string` | Live value from the `AdminHeader` search bar |

> No longer reads `dashboardData` — it fetches its own data so it can page through
> the full question set rather than only the dashboard's "recent" slice.

## Data source

```ts
fetchAdminQuestions({ page, limit: 10, search })
  → GET /api/questions?page=&limit=10&sort=latest&search=
  → { questions, pagination: { page, pages, total, limit } }
```

Admins receive **every** question from `listQuestions` (moderation/`removed`
filters are bypassed via `isAdmin`); `author_name` is resolved server-side.
Service: [`pages/admin/service.js`](../../service.js).

## Pagination (frontend + backend)

- **Backend** paginates via `page`/`limit` and returns `pagination` (`paginationResult`).
- **Frontend** holds `page` state and renders Prev/Next + `page / pages`. Changing
  page refetches that slice from the server (true server-side paging — not a
  client slice). `PAGE_SIZE = 10`.

## Search

The header `searchQuery` is **debounced (300ms)** and sent as the `search` query
param, so matching runs server-side across all questions (title/body/answers).
Page resets to 1 on a new term.

## Card details

Each card surfaces as much as the model exposes:

- **Badges:** short `#id`, `kind` (community/faq), `status`, non-approved
  `moderation_status`, `is_pinned`, `is_locked`, `has_expert_answer`, `spark_bounty`,
  **approval status** (`approval_status = 'pending'` → orange "Approval pending" banner;
  `approval_status = 'approved'` → green "Approval received" banner)
- **Content:** `title` + a 2-line preview (`body_plain`, falling back to stripped `body`)
- **Tags:** `tags` chips
- **Meta/stats:** author (`author_name`, or *Anonymous*), `upvotes`, `answer_count`,
  `view_count`, `assigned_to`, `created_at`, and `last_activity_at` when it differs

## Filters

| Filter | Param | Values | Description |
|--------|-------|--------|-------------|
| Status | `filterStatus` | `open` \| `unanswered` \| `in_progress` \| `closed` \| `resolved` | Question status |
| Kind | `filterKind` | `community` \| `faq` | Question kind |
| ID | `debouncedFilterId` | string | Exact question ID match |
| Expert | `filterExpert` | `true` \| `false` | `has_expert_answer` flag |
| Approval | `filterApproval` | `true` (pending) \| `approved` \| `false` (not pending) | `approval_status` filter |

The Approval filter drives the "Approval Pending" / "Approval Received" / "Any Approval"
select. Selecting `true` sets `hasApproval=true` which maps to `approval_status=pending`
in the `listQuestions` backend; `approved` maps directly; `false` excludes pending.

## States

- **Loading** — "Loading queries…"
- **Empty** — "No queries yet." or "No queries match …" when searching.
</content>
