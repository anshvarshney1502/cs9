# Query Detail (admin)

Read-only admin view of a single question with its full thread — body, answers,
comments, authors, votes, status, and moderation state. Opened from a card in
[Queries Management](../QueriesManagement/).

- **Component:** [`index.jsx`](./index.jsx) — `AdminQueryDetailView`
- **Props:** `queryId` (selected question id), `onBack` (return to the list).
- **Rendered by:** [`pages/admin/index.jsx`](../../index.jsx) when
  `currentAdminView === 'queryDetail'`; `selectedQueryId` is set by clicking a
  Queries card (`onOpenQuery`).

## Data

```ts
fetchQuestionDetail(queryId)  → GET /api/questions/:id
  → { question, answers, comments }
```

Reuses the user-side service ([`pages/user/service.js`](../../../user/service.js)).
As an admin the endpoint returns **everything** — including answers/comments that
are soft-deleted or under review (bodies are not redacted for admins).

## What it shows

- **Question** — id, kind, status, non-approved moderation status, pinned/locked,
  expert-answered, bounty, **Anonymous** badge, title, HTML body, tags, and a stat
  row (author, upvotes, answers, views, assignee, created time).
- **Answers** — each with author, score (`upvotes − downvotes`), Accepted /
  Expert / Official badges, **Deleted** / **Under review** state (derived from the
  raw `is_deleted` / `moderation_status`), body, and references.
- **Comments** — nested under their answer; question-level comments shown separately.

## Escalation / Approval workflow

The detail view has a **"Seek Approval"** tab (`commentTab === 'seek_approval'`)
beside the normal "Write" / "Preview" answer composer tabs. When the admin
clicks it, a picker appears to select another admin as the escalation target:

1. **Select authority** — dropdown listing all admins (fetched via `fetchUsers({ role: 'ADMIN' })`).
2. **Submit** → `adminSeekApproval(queryId, adminId, adminName)` →
   `POST /api/admin/questions/:id/seek-approval`.

Backend sets `question.approval_status = 'pending'` and creates an `Approval` record.
The question then shows an orange **"Approval pending"** banner with the target
admin's name. A second admin who receives it calls
`adminMarkApprovalReceived(queryId)` → `POST /api/admin/questions/:id/approve-request`,
updating `Approval.status = 'approved'`. The banner turns green.

If the acting admin is the target (same person), they can directly "Mark Approval
Received" via a button in the answer composer area without going through the seek step.

```ts
adminSeekApproval(queryId, adminId, adminName)  → POST /api/admin/questions/:id/seek-approval
adminMarkApprovalReceived(queryId)              → POST /api/admin/questions/:id/approve-request
```

Both require `ADMIN` role. Errors surface as `notifyError` toasts.

## Admin response (comment + resolve)

A composer lets the admin post an authoritative reply that **resolves the question
immediately**:

```ts
adminResolveQuery(queryId, body)  → POST /api/admin/questions/:id/resolve  { body }
```

Backend (`adminCommentAndResolve` in [`admin.controller.js`](../../../../../backend/src/controllers/admin.controller.js)):
- creates an answer authored by the acting admin but stamped `author_role: 'ADMIN'`,
  flagged `is_expert` + `is_official`;
- sets the question `status: 'closed'` (resolved), `has_expert_answer: true`, bumps `answer_count`;
- notifies the asker.

The reply renders as **"ADMIN"** in the thread — `getQuestionById` maps any
`author_role === 'ADMIN'` to the name `ADMIN`, so the individual admin's identity
is never shown, no matter who posts.

> The "Mark Approval Received" button appears below the answer composer when
> `q.approval_status === 'pending'` and the acting admin matches the
> `approval_requested_from` (self-approval shortcut).

## Anonymous indication

When `question.is_anonymous` is true, the author renders as *Anonymous* with a
mask icon and an **Anonymous** badge (also shown on the Queries list card). The
API already returns `author_name: 'Anonymous'` for anonymous questions.

> Note: opening this view hits `GET /api/questions/:id`, which increments the
> question's `view_count` — see the tracked issue on unique view counting.

## States

- **Loading** — "Loading question…"
- **Error / not found** — "This question could not be loaded."
</content>
