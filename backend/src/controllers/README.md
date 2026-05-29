# Controllers

Each file handles a logical group of routes. All controllers receive Express `req`/`res`/`next` and are async-first.

---

## auth.controller.js

**Login, logout, register, password reset.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | Public | Create new user account |
| `/api/auth/login` | POST | Public | Login → sets HttpOnly cookie + returns user |
| `/api/auth/logout` | POST | Required | Clears HttpOnly cookie |
| `/api/auth/forgot-password` | POST | Public | Sends reset token email |
| `/api/auth/reset-password` | POST | Public | Resets password with token |
| `/api/auth/me` | GET | Required | Returns current user from cookie |

**Auth flow:** JWT stored in `HttpOnly` cookie (not localStorage). `verifyToken` middleware extracts user from cookie and attaches to `req.user`.

---

## question.controller.js

**FAQ and discussion question CRUD, search, tags.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/questions` | GET | Public | List/search questions (`kind=faq\|community`) |
| `/api/questions/tags` | GET | Public | Distinct tags across published questions |
| `/api/questions` | POST | Required | Create discussion question |
| `/api/questions/:id` | GET | Public | Get single question |
| `/api/questions/:id` | PATCH | Owner/Admin | Update question |
| `/api/questions/:id/vote` | POST | Required | Toggle upvote |
| `/api/faqs` | GET | Public | Grouped FAQ list by tag (landing page) |

**Dual-type model:** `kind: 'faq'` (published FAQ, 1 answer required before publish) vs `kind: 'community'` (open discussion).

**Search:** `GET /api/questions?search=&kind=community&sort=trending\|latest&status=unanswered\|closed&tag=&my=1`

---

## answer.controller.js

**Answer on questions.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/questions/:questionId/answers` | GET | Public | List answers for a question |
| `/api/questions/:questionId/answers` | POST | Required | Submit answer |
| `/api/answers/:id` | PATCH | Owner/Admin | Edit answer |
| `/api/answers/:id/accept` | POST | QuestionAuthor | Accept answer |
| `/api/answers/:id/vote` | POST | Required | Toggle upvote |

**Notifications:** Answer author notified when their answer is accepted.

---

## comment.controller.js

**Threaded comments on answers.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/answers/:answerId/comments` | GET | Public | List comments for an answer |
| `/api/answers/:answerId/comments` | POST | Required | Add comment (`depth: 0`) |
| `/api/comments/:id/reply` | POST | Required | Reply to comment (`depth: 1`, sets `parent_id`, `root_comment_id`) |

**Threading:** `depth: 0` = top-level comment, `depth: 1` = reply. `root_comment_id` chains all replies to the root.

**Notifications:** Comment author notified when replied to. Answer author notified of new comment.

---

## user.controller.js

**User listing, status, contributions.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users` | GET | Admin | List all users (paginated) |
| `/api/users/:userId` | GET | Required | Get user by ID |
| `/api/users/:userId/contributions` | GET | Required | User's questions + answers + comments (sorted by time) |
| `/api/users/:userId/status` | PATCH | Admin | Activate/suspend user |

---

## profile.controller.js

**Own profile management.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `GET /api/profile/me` | GET | Required | Get own profile |
| `PATCH /api/profile/me` | PATCH | Required | Update displayName, bio, avatar, socialLinks |

**Note:** `displayName` is also synced back to `User.name` for consistency with the auth store.

---

## notification.controller.js

**In-app notifications.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/notifications` | GET | Required | List own notifications |
| `/api/notifications/:id/read` | PATCH | Owner | Mark single as read |
| `/api/notifications/read-all` | PATCH | Required | Mark all as read |

---

## spark.controller.js

**Spark points transactions and balance.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/spark/balance` | GET | Required | Get own spark balance |
| `/api/spark/transactions` | GET | Required | List own transactions |
| `/api/spark/award` | POST | Admin/Resolver | Award sparks to user |

**Points flow:** Ask question (+2), submit answer (+5), answer accepted (+15), daily login (+1), bounty reserve (–N), bounty refund (+N).

---

## flag.controller.js

**Content reporting pipeline.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/flags` | POST | Required | Report content (question, answer, or comment) |
| `/api/flags` | GET | Admin | List pending flags |
| `/api/flags/:id/review` | PATCH | Admin | Take action (dismiss/warn/remove) |

**Pipeline:** `pending_review` → `reviewed` → `action_taken`. Actions: `dismiss`, `warn_user`, `remove_content`, `suspend_user`.

---

## moderation.controller.js

**Content moderation (approve/reject/spam-hammer).**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `POST /api/moderation/questions/:id/approve` | POST | Admin/Resolver | Approve question |
| `POST /api/moderation/questions/:id/reject` | POST | Admin/Resolver | Reject question |
| `POST /api/moderation/questions/:id/spam` | POST | Admin | Mark as spam and remove |

---

## admin.controller.js

**Admin-only operations.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/admin/dashboard-stats` | GET | Admin | Overview counts (users, questions, answers) |
| `/api/admin/all-questions` | GET | Admin | All questions with full detail |
| `/api/admin/all-users` | GET | Admin | Full user list with roles |

---

## resolver.controller.js

**Resolver-specific operations.**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/resolver/dashboard-stats` | GET | Resolver | Resolver-specific stats |
| `/api/resolver/assigned-questions` | GET | Resolver | Questions assigned to this resolver |

---

## Middleware (shared across controllers)

| Middleware | Purpose |
|-----------|---------|
| `verifyToken` | Extracts JWT from cookie, attaches `req.user` |
| `checkRole(role)` | Returns 403 unless one of `req.user.roles` matches |
| `error.middleware.js` | Global error handler → consistent JSON error responses |
