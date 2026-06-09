# Project Documentation
## Crowd-Sourced FAQ Portal

### 1. Project Overview

The repository implements a MERN-style crowd-sourced FAQ and question-resolution portal. The current product is branded in the code as Vicharanashala / Rogare / QueryHub, with `project.yml` setting the display name to "Vicharanashala" and the tagline to "Lab Internship Hub". Based on the implementation, the portal is intended to help internship users browse curated FAQ entries, ask new community questions, answer other users' questions, discuss answers, report content, and allow administrators to moderate and curate resolved questions into FAQ entries.

The main user roles are:

| Role | Purpose in the implementation |
|---|---|
| `USER` | Browses FAQs, logs in, raises questions, answers, comments, votes, reports content, manages profile, and views own contributions. |
| `RESOLVER` | Backend role supported for resolver queues, resolver stats, expertise, and expert-answer behavior. The current frontend does not expose a separate resolver dashboard route. |
| `ADMIN` | Uses the admin panel to view platform metrics, manage questions, users, roles, tags, FAQs, flags, platform settings, and FAQ export workflows. |

Core workflow implemented in the code:

1. Public visitors browse published FAQ entries grouped by tag on `/`.
2. Authenticated users enter the dashboard, search/filter community questions, raise a question, attach files, and optionally submit anonymously.
3. Users or resolvers/admins answer questions; answer threads support comments, one-level replies, votes, reports, and accepted resolutions.
4. Question authors can mark questions resolved or accept an answer; admins can respond as `ADMIN` and resolve a question.
5. Admins can request approval from another admin before exporting a resolved question into the FAQ database.
6. Admins curate FAQ entries, manage tags, moderate flagged content, manage users, and tune platform settings.

The problem solved is a structured internship-support workflow: common questions become public FAQs, while new or unresolved questions flow through a community discussion and admin moderation process. Some capabilities are backend-only or partially surfaced, such as resolver-specific APIs and signup; those are noted in later sections.

### 2. Technology Stack

#### Frontend

| Area | Actual implementation |
|---|---|
| Framework/library | React `^19.2.6` in `frontend/package.json` |
| Build tool | Vite `^8.0.12` with `@vitejs/plugin-react` in `frontend/vite.config.js` |
| Routing | `react-router-dom` `^7.16.0`, route table in `frontend/src/routes/index.jsx` |
| Styling | Tailwind CSS v4 through `@tailwindcss/vite`; design tokens in `frontend/src/index.css` |
| UI/helpers | Headless UI, lucide-react icons, react-toastify, Recharts, DOMPurify, marked |
| API handling | Axios wrappers in `frontend/src/api/axios.jsx` |
| State management | Zustand persisted stores: `frontend/src/store/useAuthStore.js` and `frontend/src/store/useThemeStore.js`; TanStack Query is used on the public FAQ landing page and configured in `frontend/src/lib/queryClient.js` |

#### Backend

| Area | Actual implementation |
|---|---|
| Runtime | Node.js ESM, Node `>=20` required in `backend/package.json` |
| Framework | Express `^5.2.1` |
| Database access | Mongoose `^9.6.2` |
| Authentication | Custom HMAC SHA-256 JWT-style token in `backend/src/utils/auth-token.js`; token set as HTTP-only cookie by login and also accepted from `Authorization: Bearer` |
| Password hashing | Argon2 in `backend/src/controllers/auth.controller.js` and `profile.controller.js` |
| Validation | `express-validator` for auth route validation; model validation through Mongoose; additional manual checks in controllers/services |
| Error handling | `notFound` and `errorHandler` in `backend/src/middleware/error.middleware.js` |
| Middleware | `helmet`, `cors`, JSON body limit, global express-rate-limit, route-specific login/signup/question limiters, Multer for question attachments |
| API docs | Swagger UI at `/api/docs` and JSON at `/api/docs.json` through `backend/src/config/swagger.js` |
| Scheduled work | `node-cron` assignment job started in `backend/src/server.js` |

#### Database

| Area | Actual implementation |
|---|---|
| Database | MongoDB |
| ODM | Mongoose |
| Main models | User, UserProfile, Role, UserRoleMapper, Question, FAQQuestion, Answer, Comment, Vote, Flag, Notification, SparkTransaction, Tag, Approval, PlatformSettings, QuestionAssignmentLog, QuestionView |
| FAQ storage | `FAQQuestion` reuses `questionSchema`; it uses a separate FAQ connection when `faqConnection` is available |

#### Tools and Deployment

| Area | Actual implementation |
|---|---|
| Frontend scripts | `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run preview` |
| Backend scripts | `npm run dev`, `npm start`, `npm test`, seed/rebuild/reputation scripts |
| Git hooks | Husky pre-commit hook under `frontend/.husky/pre-commit` |
| Deployment indicators | No platform-specific deployment files such as Vercel/Render/Railway config were found. `run-dev.sh` starts local backend and frontend processes. |
| Environment variables | Tracked examples are in `backend/.env.example` and `frontend/.env.example`; actual `.env` files exist locally but are ignored by git. |

### 3. Repository Structure

```text
project-root/
+-- AGENTS.md
+-- CONTEXT.md
+-- CONTRIBUTING.md
+-- README.md
+-- FEATURE.md
+-- WORKFLOW.md
+-- project.yml
+-- run-dev.sh
+-- .github/
|   +-- PULL_REQUEST_TEMPLATE.md
|   +-- ISSUE_TEMPLATE/
+-- backend/
|   +-- package.json
|   +-- .env.example
|   +-- eslint.config.js
|   +-- ER_DIAGRAM.md
|   +-- LEADERBOARD.md
|   +-- FILESTRUCTURE.md
|   +-- src/
|       +-- app.js
|       +-- server.js
|       +-- config/
|       +-- controllers/
|       +-- middleware/
|       +-- models/
|       +-- routes/
|       +-- scheduled/
|       +-- scripts/
|       +-- services/
|       +-- tests/
|       +-- utils/
+-- frontend/
    +-- package.json
    +-- .env.example
    +-- vite.config.js
    +-- tsconfig.json
    +-- eslint.config.js
    +-- DESIGN.md
    +-- FILESTRUCTURE.md
    +-- public/
    +-- src/
        +-- App.jsx
        +-- main.jsx
        +-- index.css
        +-- api/
        +-- components/
        +-- lib/
        +-- pages/
        |   +-- landing/
        |   +-- user/
        |   +-- admin/
        +-- routes/
        +-- store/
```

| Path | Purpose |
|---|---|
| `backend/src/app.js` | Builds the Express app, applies global middleware, mounts routes, and serves Swagger docs. |
| `backend/src/server.js` | Loads environment variables, connects to MongoDB, starts cron, and listens on `PORT`. |
| `backend/src/routes/` | Express route definitions grouped by module. |
| `backend/src/controllers/` | Request handlers and business workflow entry points. |
| `backend/src/models/` | Mongoose schemas and MongoDB collection mapping. |
| `backend/src/services/` | Shared logic for roles, sparks, moderation, settings, leaderboards, dashboard events, and assignment. |
| `backend/src/tests/` | Node test files using `node:test`. |
| `frontend/src/routes/` | React Router configuration and protected-route gate. |
| `frontend/src/pages/landing/` | Public FAQ landing page and login modal. |
| `frontend/src/pages/user/` | Authenticated user layout, service layer, dashboard, raise query, query detail, contributions, leaderboard, profile. |
| `frontend/src/pages/admin/` | Admin shell, routes helper, service layer, dashboard, moderation, users, settings, FAQ management, query detail. |
| `frontend/src/components/` | Shared Button, Input, Select, Modal, and Footer components. |
| `frontend/src/store/` | Persisted Zustand auth and theme stores. |

### 4. System Architecture

```text
User -> React Frontend -> Axios API Client -> Express API -> Mongoose Models -> MongoDB Database
```

The frontend is a Vite React single-page application. Public FAQ data is loaded from `/api/faqs`. Authenticated areas use the private Axios client in `frontend/src/api/axios.jsx`, which sends credentials using `withCredentials: true`.

The backend is an Express application. It mounts route groups under `/api/*`, uses Mongoose models to read and write MongoDB collections, and returns JSON responses. Most protected routes pass through `verifyToken` from `backend/src/middleware/authMiddleware.js`, then optionally through `checkRole(...)`.

Authentication flow:

```text
Login form -> POST /api/auth/login -> argon2 password verification -> signAuthToken()
-> HTTP-only token cookie -> frontend bootstrap GET /api/auth/me -> Zustand auth store
```

Token handling:

| Layer | Implementation |
|---|---|
| Token creation | `signAuthToken()` in `backend/src/utils/auth-token.js`, default 7-day expiry |
| Token transport | Login sets HTTP-only cookie named `token`; bearer tokens are also accepted by middleware |
| Token verification | `verifyAuthToken()` checks HMAC signature and expiry |
| Frontend storage | User object is persisted in localStorage by Zustand key `rogare-auth`; token itself is not stored by frontend code and is expected in the HTTP-only cookie |
| Logout | `POST /api/auth/logout` clears the cookie and frontend clears auth state |

Database interaction flow:

```text
Controller -> Service/helper if needed -> Mongoose model -> MongoDB collection
```

Examples:

| Workflow | Code path |
|---|---|
| Public FAQ listing | `frontend/src/pages/landing/service.jsx` -> `GET /api/faqs` -> `question.controller.listPublishedFAQs` -> `FAQQuestion` |
| Raise query | `RaiseQuery/index.jsx` -> `createQuestion()` -> `POST /api/questions` -> `question.controller.createQuestion` -> `Question` |
| Answer question | `QueryDetail/index.jsx` -> `POST /api/questions/:questionId/answers` -> `answer.controller.createAnswer` -> `Answer`, `Question`, `SparkTransaction`, `Notification` |
| Flag content | `ReportModal` via `reportContent()` -> `POST /api/flags` -> `flag.controller.createFlag` -> `Flag` and target moderation status |
| Admin FAQ export | `Admin QueryDetail` -> `POST /api/admin/questions/:questionId/export-faq` -> `admin.controller.exportQuestionToFAQ` -> `FAQQuestion` and original `Question.linked_faq_id` |

### 5. Features Implemented

#### Authentication

| Feature | Implementation status | Relevant files |
|---|---|---|
| Login | Implemented in backend and frontend login modal | `backend/src/routes/auth.routes.js`, `backend/src/controllers/auth.controller.js`, `frontend/src/pages/landing/LoginModal/index.jsx`, `frontend/src/pages/landing/LoginModal/service.jsx` |
| Logout | Implemented for user and admin layouts | `backend/src/controllers/auth.controller.js`, `frontend/src/pages/user/service.js`, `frontend/src/pages/admin/service.js` |
| Signup/registration | Backend endpoint exists. No frontend registration page was found. | `backend/src/routes/auth.routes.js`, `backend/src/controllers/auth.controller.js` |
| Current user/session bootstrap | Implemented through `/api/auth/me` | `frontend/src/App.jsx`, `backend/src/controllers/auth.controller.js` |
| Password hashing | Implemented with argon2 | `backend/src/controllers/auth.controller.js`, `backend/src/controllers/profile.controller.js` |
| Password strength validation | Implemented on backend | `backend/src/controllers/auth.controller.js`, `backend/src/tests/auth.controller.test.js` |
| Protected routes | Implemented in frontend and backend | `frontend/src/routes/ProtectedRoute.jsx`, `backend/src/middleware/authMiddleware.js` |
| Role-based access | Implemented for `USER`, `RESOLVER`, `ADMIN` | `backend/src/services/role.service.js`, route files under `backend/src/routes/` |
| Forgot password | Frontend-only message in login modal; no backend reset endpoint was found. | `frontend/src/pages/landing/LoginModal/index.jsx` |

#### FAQ Management

| Feature | Implementation status | Relevant files |
|---|---|---|
| Public FAQ listing grouped by tags | Implemented | `backend/src/controllers/question.controller.js`, `backend/src/app.js`, `frontend/src/pages/landing/index.jsx`, `frontend/src/pages/landing/service.jsx` |
| Admin create FAQ | Implemented through `POST /api/questions` with `kind: 'faq'` | `backend/src/controllers/question.controller.js`, `frontend/src/pages/admin/pages/FAQManagement/index.jsx` |
| Admin update FAQ | Implemented through question update endpoint | `backend/src/controllers/question.controller.js`, `frontend/src/pages/admin/service.js`, `frontend/src/pages/admin/pages/FAQManagement/index.jsx` |
| Admin delete FAQ | Implemented as soft delete (`status: removed`) | `backend/src/controllers/question.controller.js`, `frontend/src/pages/admin/pages/FAQManagement/index.jsx` |
| Export resolved approved question to FAQ | Implemented | `backend/src/controllers/admin.controller.js`, `backend/src/tests/export-faq.test.js`, `frontend/src/pages/admin/pages/QueryDetail/index.jsx` |
| FAQ search on landing page | Implemented client-side over loaded FAQ sections | `frontend/src/pages/landing/index.jsx` |
| FAQ tag/category navigation | Implemented on landing page | `frontend/src/pages/landing/index.jsx` |
| FAQ tag management | Implemented for admins | `backend/src/controllers/admin.controller.js`, `frontend/src/pages/admin/pages/FAQManagement/index.jsx` |

#### Question Management

| Feature | Implementation status | Relevant files |
|---|---|---|
| Create community question | Implemented with tags, anonymity, and optional attachments | `backend/src/routes/question.routes.js`, `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/RaiseQuery/index.jsx` |
| View question list | Implemented with pagination and filters | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/Dashboard/index.jsx` |
| View question detail | Implemented with answers, comments, attachments, status, and related queries | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Search/filter questions | Implemented with query params for search, tag, status, createdAfter, my, hasExpertAnswer, hasApproval, kind, id | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/service.js`, `frontend/src/pages/admin/service.js` |
| Update question | Backend implemented for owner/admin; no user-facing edit question UI was found in current frontend | `backend/src/controllers/question.controller.js` |
| Delete question | Backend implemented for owner/admin; no user-facing delete question UI was found for original questions | `backend/src/controllers/question.controller.js` |
| Vote question | Implemented for upvote toggle; own-question voting is blocked | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/Dashboard/index.jsx` |
| Resolve/reopen question | Implemented for owner/admin | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| View count | Implemented with per-user dedup and author exclusion | `backend/src/controllers/question.controller.js`, `backend/src/models/question_view.model.js`, `backend/src/tests/question-view.test.js` |
| Attachments | Implemented for PDF, JPG, PNG; 5MB per file and 12MB total guard | `backend/src/routes/question.routes.js`, `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/RaiseQuery/index.jsx` |

#### Answer and Comment Management

| Feature | Implementation status | Relevant files |
|---|---|---|
| Add answer | Implemented | `backend/src/controllers/answer.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Edit answer | Implemented for owner/admin; non-admin edit window is 15 minutes | `backend/src/controllers/answer.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Delete answer | Implemented as soft delete | `backend/src/controllers/answer.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Vote answer | Implemented for up/down voting with toggle/flip behavior | `backend/src/controllers/answer.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Accept answer | Implemented; accepting closes the question and can award bounty | `backend/src/controllers/question.controller.js`, `frontend/src/pages/user/pages/QueryDetail/index.jsx` |
| Unaccept answer | Implemented for admins only via route; frontend admin/user service exposes it | `backend/src/routes/question.routes.js`, `backend/src/controllers/question.controller.js` |
| Add comment | Implemented for answers only | `backend/src/controllers/comment.controller.js`, `frontend/src/pages/user/components/AnswerComments/AnswerComments.jsx` |
| Comment replies | Implemented one level deep | `backend/src/models/comment.model.js`, `backend/src/controllers/comment.controller.js` |
| Edit comment | Implemented for owner/admin; non-admin edit window is 15 minutes | `backend/src/controllers/comment.controller.js`, `frontend/src/pages/user/components/AnswerComments/AnswerComments.jsx` |
| Delete comment | Implemented as soft delete | `backend/src/controllers/comment.controller.js`, `frontend/src/pages/user/components/AnswerComments/AnswerComments.jsx` |

#### Admin and Moderator Features

| Feature | Implementation status | Relevant files |
|---|---|---|
| Admin dashboard metrics and charts | Implemented | `backend/src/controllers/admin.controller.js`, `frontend/src/pages/admin/pages/Dashboard/index.jsx` |
| Query management | Implemented with filters and pagination | `frontend/src/pages/admin/pages/QueriesManagement/index.jsx`, `backend/src/controllers/question.controller.js` |
| Admin response and resolve | Implemented | `backend/src/controllers/admin.controller.js`, `frontend/src/pages/admin/pages/QueryDetail/index.jsx` |
| Approval request and approval received | Implemented | `backend/src/controllers/admin.controller.js`, `backend/src/models/approval.model.js`, `frontend/src/pages/admin/pages/QueryDetail/index.jsx` |
| User management | Implemented | `backend/src/controllers/user.controller.js`, `backend/src/controllers/admin.controller.js`, `frontend/src/pages/admin/pages/UserManagement/index.jsx` |
| Role assignment/removal | Implemented; final admin role guard exists | `backend/src/controllers/admin.controller.js`, `backend/src/services/role.service.js` |
| Account status management | Implemented with active/disabled/suspended | `backend/src/controllers/user.controller.js` |
| Flag moderation | Implemented | `backend/src/controllers/flag.controller.js`, `backend/src/controllers/moderation.controller.js`, `frontend/src/pages/admin/pages/FlagModeration/index.jsx` |
| Moderation actions | Implemented for approve/hide/restore/delete/lock/unlock and flag resolution actions | `backend/src/services/content.service.js`, `backend/src/controllers/flag.controller.js` |
| Platform settings | Implemented | `backend/src/services/platform-settings.service.js`, `backend/src/models/platform-settings.model.js`, `frontend/src/pages/admin/pages/Settings/index.jsx` |
| Spark leaderboard/admin leaderboard | Implemented | `backend/src/controllers/spark.controller.js`, `frontend/src/pages/admin/pages/SparkLeaderboard/index.jsx` |
| Resolver queue/stats/expertise APIs | Backend implemented; no dedicated frontend route found | `backend/src/routes/resolver.routes.js`, `backend/src/controllers/resolver.controller.js` |
| Auto-assignment cron | Implemented and started by server | `backend/src/scheduled/question-assignment.js`, `backend/src/services/question-allocation.service.js`, `backend/src/server.js` |

#### UI/UX Features

| Feature | Implementation status | Relevant files |
|---|---|---|
| Responsive layouts | Implemented with Tailwind utility classes across landing/user/admin pages |
| Dark mode | Implemented with Zustand and `.dark` class | `frontend/src/store/useThemeStore.js`, `frontend/src/pages/user/layout.jsx`, `frontend/src/pages/admin/index.jsx` |
| Toast messages | Implemented through react-toastify wrappers | `frontend/src/lib/notify.js` |
| Loading states | Implemented throughout pages with loaders/spinners |
| Empty states | Implemented in landing, dashboard, contribution, leaderboard, admin lists |
| Markdown editing/preview | Implemented for query descriptions, answers, FAQ editing/export | `frontend/src/lib/markdown.js`, `RaiseQuery/index.jsx`, `QueryDetail/index.jsx`, `FAQManagement/index.jsx` |
| Sanitized rendered markdown | Implemented with marked + DOMPurify | `frontend/src/lib/markdown.js` |
| Notification sidebars | Implemented for user and admin layouts | `frontend/src/pages/user/components/NotifSidebar/NotificationSidebar.tsx`, `frontend/src/pages/admin/components/NotificationSidebar/AdminNotificationSidebar.tsx` |
| Onboarding tours | Implemented in user/admin layouts | `frontend/src/pages/user/components/OnboardingTour/OnboardingTour.jsx`, `frontend/src/pages/admin/components/OnboardingTour/AdminOnboardingTour.jsx` |

### 6. Database Design

Most relationships use application-level UUID string fields such as `user_id`, `question_id`, `answer_id`, and `comment_id`, rather than Mongoose `ObjectId` refs. Timestamps are usually mapped to snake_case fields.

#### User

File: `backend/src/models/user.model.js`  
Collection: `users`  
Purpose: Stores login identity, account status, cached spark balance, and last login time.

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | String UUID | No, generated | Immutable unique public user ID. |
| `name` | String | Yes | User name, trimmed, max 100. |
| `email` | String | Yes | Unique lowercase email with regex validation. |
| `passwordHash` | String | Yes | Argon2 hash, excluded by default with `select: false`. |
| `status` | String enum | No | `active`, `disabled`, or `suspended`; default `active`. |
| `status_reason` | String | No | Admin status-change reason. |
| `status_updated_by` | String | No | User ID of admin who updated status. |
| `status_updated_at` | Date | No | Timestamp of status update. |
| `spark_points` | Number | No | Cached spark balance; source of truth is `spark_transactions`. |
| `last_login_at` | Date | No | Last login timestamp used for daily login sparks. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### UserProfile

File: `backend/src/models/user-profile.model.js`  
Collection: `user_profiles`  
Purpose: Stores public/profile metadata and reputation.

| Field | Type | Required | Description |
|---|---|---|---|
| `profile_id` | String UUID | No, generated | Immutable unique profile ID. |
| `user_id` | String | Yes | Unique user ID this profile belongs to. |
| `display_name` | String | No | Display name shown in UI. |
| `bio` | String | No | User biography. |
| `avatar_url` | String | No | Avatar URL. |
| `location` | String | No | Private profile location in own profile response. |
| `social_links` | Map[String] | No | Social link map. |
| `reputation` | Number | No | Quality/trust score, default 0. |
| `phone` | String | No | Phone field. |
| `credentials_url` | String | No | Resolver/expert credential URL. |
| `expertise` | String[] | No | Expertise terms. |
| `categories` | String[] | No | Resolver categories. |
| `tags` | String[] | No | Resolver tags. |
| `onboarding_completed` | Boolean | No | Onboarding completion flag. |
| `onboarding_step` | Number | No | Current onboarding step. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### Role

File: `backend/src/models/role.model.js`  
Collection: `roles`  
Purpose: Defines available role names.

| Field | Type | Required | Description |
|---|---|---|---|
| `role_id` | String UUID | No, generated | Immutable unique role ID. |
| `name` | String | Yes | Unique lowercase role name. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### UserRoleMapper

File: `backend/src/models/user-role-mapper.model.js`  
Collection: `user_role_mappers`  
Purpose: Many-to-many mapping between users and roles.

| Field | Type | Required | Description |
|---|---|---|---|
| `user_role_id` | String UUID | No, generated | Immutable unique mapping ID. |
| `user_id` | String | Yes | User UUID. |
| `role_id` | String | Yes | Role UUID. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

Relationship: `(user_id, role_id)` has a unique compound index.

#### Question

File: `backend/src/models/question.model.js`  
Collection: `questions`  
Purpose: Stores community questions and can also represent FAQ-style records by `kind`, although the current FAQ model can use a separate connection.

| Field | Type | Required | Description |
|---|---|---|---|
| `question_id` | String UUID | No, generated | Immutable unique question ID. |
| `kind` | String enum | No | `faq` or `community`; default `community`. |
| `title` | String | Yes | Trimmed title, 10-300 chars. |
| `slug` | String | No | Unique sparse lowercase slug, mainly for FAQs. |
| `body` | String | Yes | Question/FAQ body. Whitespace normalized on save. |
| `tags` | String[] | No | Tags/categories. |
| `attachments` | Array | No | Embedded files with `attachment_id`, `file_name`, `mime_type`, and binary `data`. |
| `spark_bounty` | Number | No | Non-negative bounty, default 0. |
| `author_id` | String | Yes | User UUID of author. |
| `is_anonymous` | Boolean | No | Anonymous display flag, default false. |
| `status` | String enum | No | Community: `unanswered`, `answered`, `closed`, `removed`; FAQ: `draft`, `published`, `archived`. Default `unanswered`. |
| `visibility` | String enum | No | `public`, `hidden`, or `deleted`; default `public`. |
| `is_pinned` | Boolean | No | Pinned flag. |
| `is_locked` | Boolean | No | Prevents new answers/comments while visible. |
| `upvotes` | Number | No | Cached question upvotes. |
| `assigned_to` | String/null | No | Resolver/admin user UUID assignment. |
| `approval_requested_from` | String/null | No | Admin user ID requested for approval. |
| `approval_requested_from_name` | String/null | No | Name captured for approval display. |
| `approval_status` | String enum/null | No | `pending` or `approved`. |
| `view_count` | Number | No | Cached unique view count. |
| `answer_count` | Number | No | Cached answer count. |
| `has_expert_answer` | Boolean | No | Cached expert-answer flag. |
| `last_activity_at` | Date | No | Updated on new activity. |
| `linked_faq_id` | String/null | No | FAQ question ID created from this community question. |
| `moderation_status` | String enum | No | `approved`, `pending`, `rejected`; default `approved`. |
| `moderated_by` | String | No | Admin/moderator user ID. |
| `moderated_at` | Date | No | Moderation timestamp. |
| `moderation_reason` | String | No | Moderation note. |
| `removal_reason` | String | No | Removal reason. |
| `edit_history` | Array | No | Previous title/body snapshots with editor and time. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### FAQQuestion

File: `backend/src/models/faq.model.js`  
Purpose: Reuses `questionSchema` for FAQ entries, using `faqConnection` when available. The FAQ listing reads only records with `kind: 'faq'`, `status: 'published'`, and `visibility: 'public'`.

The fields are the same as `Question`.

#### Answer

File: `backend/src/models/answer.model.js`  
Collection: `answers`  
Purpose: Stores answers on questions, including expert/admin/official flags, votes, comments count, and moderation state.

| Field | Type | Required | Description |
|---|---|---|---|
| `answer_id` | String UUID | No, generated | Immutable unique answer ID. |
| `question_id` | String | Yes | Parent question UUID. |
| `question_kind` | String enum | No | Denormalized `faq` or `community`; default `community`. |
| `author_id` | String | Yes | User UUID of answer author. |
| `author_role` | String enum | No | Role snapshot: `USER`, `RESOLVER`, `ADMIN`; default `USER`. |
| `body` | String | Yes | Answer body, min 20 in schema. Controller currently checks at least 15 chars before create. |
| `body_plain` | String | No | Search-friendly body field, default empty. |
| `references` | Array | No | URL/label references. |
| `attachments` | Array | No | File URL/name/mime metadata for answer attachments. |
| `is_expert` | Boolean | No | True for resolver/admin answers. |
| `expert_type` | String | No | Expert subtype. |
| `specialty` | String | No | Expert specialty. |
| `is_accepted` | Boolean | No | Accepted resolution flag. |
| `is_official` | Boolean | No | Official answer flag. |
| `is_deleted` | Boolean | No | Legacy soft delete flag. |
| `visibility` | String enum | No | `public`, `hidden`, `deleted`. |
| `upvotes`, `downvotes`, `score` | Number | No | Cached vote counters. |
| `comment_count`, `top_level_comment_count` | Number | No | Cached comment counters. |
| `spark_award` | Object | No | `amount`, `awarded_at`, `transaction_id`. |
| `moderation_status` | String enum | No | `approved`, `pending`, `rejected`. |
| `moderated_by`, `moderated_at`, `moderation_reason`, `removal_reason` | String/Date | No | Moderation audit fields. |
| `edit_history` | Array | No | Previous body snapshots. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### Comment

File: `backend/src/models/comment.model.js`  
Collection: `comments`  
Purpose: Stores comments and one-level replies under answers.

| Field | Type | Required | Description |
|---|---|---|---|
| `comment_id` | String UUID | No, generated | Immutable unique comment ID. |
| `question_id` | String | Yes | Denormalized parent question UUID. |
| `answer_id` | String | Yes | Parent answer UUID. |
| `parent_id` | String/null | No | Parent comment ID for replies. |
| `root_comment_id` | String/null | No | Top-level comment ID for thread fetching. |
| `depth` | Number enum | No | 0 or 1; application caps replies at one level. |
| `author_id` | String | Yes | User UUID. |
| `author_role` | String enum | No | Posting role snapshot. |
| `body` | String | Yes | Max 2000 characters. |
| `mentions` | String[] | No | Mentioned user IDs. |
| `upvotes`, `downvotes`, `score` | Number | No | Cached vote counters; no comment vote route was found. |
| `reply_count` | Number | No | Cached reply count. |
| `flag_count` | Number | No | Flag count field. |
| `is_deleted` | Boolean | No | Legacy soft delete flag. |
| `visibility` | String enum | No | `public`, `hidden`, `deleted`. |
| `moderation_status` | String enum | No | `approved`, `pending`, `rejected`. |
| `moderated_by`, `moderated_at`, `moderation_reason` | String/Date | No | Moderation audit fields. |
| `edit_history` | Array | No | Previous body snapshots. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### Vote

File: `backend/src/models/vote.model.js`  
Collection: `votes`  
Purpose: Source-of-truth vote ledger for questions, answers, and comments.

| Field | Type | Required | Description |
|---|---|---|---|
| `vote_id` | String UUID | No, generated | Immutable unique vote ID. |
| `user_id` | String | Yes | User UUID. |
| `target_type` | String enum | Yes | `question`, `answer`, or `comment`. |
| `target_id` | String | Yes | Target UUID. |
| `value` | Number enum | Yes | `1` upvote or `-1` downvote. |
| `created_at` | Date | No | Timestamp. |

Relationship: unique compound index on `(user_id, target_type, target_id)`.

#### Flag

File: `backend/src/models/flag.model.js`  
Collection: `flags`  
Purpose: Stores content reports and admin review decisions.

| Field | Type | Required | Description |
|---|---|---|---|
| `flag_id` | String UUID | No, generated | Immutable unique flag ID. |
| `target_type` | String enum | Yes | `question`, `answer`, or `comment`. |
| `target_id` | String | Yes | Target UUID. |
| `reported_by` | String | Yes | Reporter user UUID. |
| `reason` | String | Yes | Report reason. |
| `notes` | String | No | Reporter description. |
| `status` | String enum | No | `pending`, `approved`, or `rejected`. |
| `reviewed_by` | String | No | Admin reviewer UUID. |
| `reviewed_at` | Date | No | Review timestamp. |
| `review_action` | String | No | Action such as `hide_content`. |
| `resolution_note` | String | No | Review note. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

Relationship: unique compound index on `(target_type, target_id, reported_by)`.

#### Notification

File: `backend/src/models/notification.model.js`  
Collection: `notifications`  
Purpose: Stores in-app notifications.

| Field | Type | Required | Description |
|---|---|---|---|
| `notification_id` | String UUID | No, generated | Immutable unique notification ID. |
| `recipient_id` | String | Yes | User UUID receiving notification. |
| `actor_id` | String | No | User UUID causing event. |
| `type` | String enum | Yes | `answer`, `upvote`, `badge`, `mention`, `accepted`, `flag_resolved`, `content_hidden`, `comment`, `reply`, `warning`, `account_status`. |
| `title` | String | Yes | Notification title. |
| `body` | String | Yes | Notification message. |
| `reference_id` | String | No | Related target UUID. |
| `reference_type` | String enum | No | `question`, `answer`, `comment`, `user`. |
| `link` | String | No | Frontend link. |
| `thread_anchor` | Object | No | `answer_id`, `root_comment_id` for comment threads. |
| `is_read` | Boolean | No | Read state, default false. |
| `created_at` | Date | No | Timestamp. |

#### SparkTransaction

File: `backend/src/models/spark-transaction.model.js`  
Collection: `spark_transactions`  
Purpose: Source-of-truth ledger for spark balance changes.

| Field | Type | Required | Description |
|---|---|---|---|
| `transaction_id` | String UUID | No, generated | Immutable unique transaction ID. |
| `user_id` | String | Yes | User UUID. |
| `action` | String | Yes | Spark action name. |
| `points` | Number | Yes | Signed point delta. |
| `reference_id` | String | No | Related question/answer UUID. |
| `reference_type` | String enum | No | `question` or `answer`. |
| `created_at` | Date | No | Timestamp. |

#### Tag

File: `backend/src/models/tag.model.js`  
Collection: default Mongoose collection for `Tag`  
Purpose: Stores managed tags used in questions/FAQ workflows.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Unique trimmed tag name. |
| `displayName` | String | No | Display label. |
| `description` | String | No | Tag description. |
| `questionCount` | Number | No | Cached question count. |
| `createdAt` | Date | No | Timestamp. |

#### Approval

File: `backend/src/models/approval.model.js`  
Collection: `approvals`  
Purpose: Tracks admin approval requests for questions.

| Field | Type | Required | Description |
|---|---|---|---|
| `approval_id` | String UUID | No, generated | Immutable unique approval ID. |
| `question_id` | String | Yes | Question UUID. |
| `requested_by` | String | Yes | Requesting admin UUID. |
| `requested_from` | String | Yes | Target admin UUID. |
| `requested_from_name` | String | No | Display name captured for UI. |
| `status` | String enum | No | `pending`, `approved`, `rejected`; default `pending`. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### PlatformSettings

File: `backend/src/models/platform-settings.model.js`  
Collection: `platform_settings`  
Purpose: Stores configurable weights and thresholds for leaderboard, moderation, resolver eligibility, and escalation.

| Field | Type | Required | Description |
|---|---|---|---|
| `settings_id` | String | No | Immutable unique ID, default `platform`. |
| `leaderboard.*Weight` | Number | No | Scoring weights, all non-negative. |
| `userThresholds.resolverEligibility.*` | Number | No | Resolver eligibility thresholds. |
| `userThresholds.moderationThresholds.*` | Number/Boolean | No | Warning, content review, inactivity, and auto-deactivation thresholds. |
| `questionEscalation.unresolvedHoursToEscalate` | Number | No | Hours before escalation, default 72. |
| `questionEscalation.automaticEscalationEnabled` | Boolean | No | Whether admin escalation is active. |
| `questionEscalation.includeCommentedUnresolved` | Boolean | No | Include answered-but-unclosed questions in escalation. |
| `questionEscalation.reminderHoursBeforeEscalation` | Number | No | Reminder threshold. |
| `questionEscalation.assignmentStrategy` | String enum | No | `any_admin`, `round_robin_admin`, or `default_admin`. |
| `questionEscalation.defaultAdminUserId` | String | No | Default admin ID for escalation. |
| `updated_by` | String | No | Admin user UUID that updated settings. |
| `created_at`, `updated_at` | Date | No | Mongoose timestamps. |

#### QuestionAssignmentLog

File: `backend/src/models/question-assignment-log.model.js`  
Collection: `question_assignment_logs`  
Purpose: Audit trail for automatic resolver/admin assignment.

| Field | Type | Required | Description |
|---|---|---|---|
| `assignment_log_id` | String UUID | No, generated | Immutable unique log ID. |
| `question_id` | String | Yes | Assigned question UUID. |
| `resolver_id` | String | Yes | Resolver/admin UUID assigned. |
| `assigned_by` | String | No | Defaults to `SYSTEM`. |
| `reason` | String | No | Assignment reason. |
| `assigned_at` | Date | No | Assignment timestamp. |
| `expires_at` | Date/null | No | Optional expiry. |

#### QuestionView

File: `backend/src/models/question_view.model.js`  
Collection: default Mongoose collection for `QuestionView`  
Purpose: Ensures a user counts as a viewer of a question at most once.

| Field | Type | Required | Description |
|---|---|---|---|
| `question_id` | String | Yes | Question UUID. |
| `user_id` | String | Yes | Viewer user UUID. |
| `viewed_at` | Date | No | First-view timestamp. |

Relationship: unique compound index on `(question_id, user_id)`.

### 7. API Documentation

Protected routes require `verifyToken`; role restrictions are listed when visible in route files. Response summaries are based on controller implementation.

#### System and Public FAQ APIs

| Method | Endpoint | Protected | Description | Controller |
|---|---|---|---|---|
| GET | `/` | Public | API welcome message. | Inline in `backend/src/app.js` |
| GET | `/api/health` | Public | Service health JSON with timestamp. | Inline in `backend/src/app.js` |
| GET | `/api/docs` | Public | Swagger UI. | `backend/src/app.js` |
| GET | `/api/docs.json` | Public | Swagger JSON spec. | `backend/src/app.js` |
| GET | `/api/faqs` | Public | Published FAQ entries grouped by tag. | `question.controller.listPublishedFAQs` |
| GET | `/api/questions/faqs` | Public | Alternate public FAQ listing mounted by question router. | `question.controller.listPublishedFAQs` |

#### Auth APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| POST | `/api/auth/signup` | Public, rate-limited | `name`, `email`, `password`; optional `role` rejected unless `USER` | Creates a user, default profile, and USER role mapping. | `auth.controller.signup` |
| POST | `/api/auth/login` | Public, rate-limited | `email`, `password` | Verifies password, awards daily login spark if applicable, sets HTTP-only cookie, returns safe user. | `auth.controller.login` |
| POST | `/api/auth/logout` | Yes | None | Clears auth cookie. | `auth.controller.logout` |
| GET | `/api/auth/me` | Yes | None | Returns current safe user. | `auth.controller.me` |

#### User and Profile APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| GET | `/api/users` | ADMIN | Query: `page`, `limit`, `search`, `role`, `status` | Lists users for admin management. | `user.controller.listUsers` |
| PATCH | `/api/users/:userId/status` | ADMIN | Params: `userId`; body: `status`, optional `reason` | Updates account status; prevents disabling final active admin. | `user.controller.updateUserStatus` |
| GET | `/api/users/me/contributions` | USER/RESOLVER, not ADMIN | Query: `limit` | Returns current user's contribution feed and stats. | `user.controller.getMyContributions` |
| GET | `/api/users/:userId` | USER/RESOLVER, not ADMIN for user router block | Params: `userId` | Returns public user profile and counts; email visible only to self/admin. | `user.controller.getUserById` |
| GET | `/api/users/:userId/contributions` | USER/RESOLVER, not ADMIN for user router block | Params: `userId`; query: `limit` | Returns question/answer/comment contribution feed. | `user.controller.getUserContributions` |
| GET | `/api/profile/me` | USER/RESOLVER/ADMIN | None | Returns current profile. | `profile.controller.getMyProfile` |
| PATCH | `/api/profile/me` | USER/RESOLVER/ADMIN | Editable fields: `displayName`, `bio`, `avatarUrl`, `expertise`, `location`, `socialLinks` | Updates profile. | `profile.controller.updateMyProfile` |
| PATCH | `/api/profile/password` | USER/RESOLVER/ADMIN | `currentPassword`, `newPassword` | Verifies and changes password. | `profile.controller.changeMyPassword` |
| GET | `/api/profile/:userId` | USER/RESOLVER/ADMIN | Params: `userId` | Returns public profile with private fields removed. | `profile.controller.getPublicProfile` |

#### Question APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| POST | `/api/questions` | USER/RESOLVER/ADMIN, rate-limited | Body/form-data: `title`, `body`, `tags`, `isAnonymous`, `sparkBounty`, attachments. Admin may pass `kind: faq`. | Creates community question or admin FAQ. | `question.controller.createQuestion` |
| GET | `/api/questions` | USER/RESOLVER/ADMIN | Query: `kind`, `page`, `limit`, `search`, `tag`, `status`, `sort`, `createdAfter`, `my`, `id`, `hasExpertAnswer`, `hasApproval` | Lists paginated questions. | `question.controller.listQuestions` |
| GET | `/api/questions/tags` | USER/RESOLVER/ADMIN | None | Lists top distinct community question tags. | `question.controller.listQuestionTags` |
| GET | `/api/questions/counts` | USER/RESOLVER/ADMIN | Query: `kind`, `search`, `tag`, `my` | Returns dashboard tab counts. | `question.controller.getQuestionCounts` |
| GET | `/api/questions/:questionId` | USER/RESOLVER/ADMIN | Params: `questionId`; query: `includeAnswers`, `includeComments` | Returns question detail with answers/comments. | `question.controller.getQuestionById` |
| GET | `/api/questions/:questionId/attachments/:attachmentId` | USER/RESOLVER/ADMIN | Params: `questionId`, `attachmentId`; query: `preview=true` | Downloads or previews embedded attachment. | `question.controller.downloadQuestionAttachment` |
| POST | `/api/questions/:questionId/view` | USER/RESOLVER/ADMIN | Params: `questionId` | Records unique non-author view. | `question.controller.recordQuestionView` |
| PATCH | `/api/questions/:questionId` | USER/RESOLVER/ADMIN | Params: `questionId`; body: `title`, `body`, `tags`; admin may update more fields | Updates question/FAQ if owner/admin. | `question.controller.updateQuestion` |
| DELETE | `/api/questions/:questionId` | USER/ADMIN | Params: `questionId`; optional `reason` | Soft-deletes question/FAQ. | `question.controller.deleteQuestion` |
| POST | `/api/questions/:questionId/vote` | USER/RESOLVER/ADMIN | Params: `questionId` | Toggles question upvote. | `question.controller.voteQuestion` |
| PATCH | `/api/questions/:questionId/resolve` | USER/RESOLVER/ADMIN | Body: `resolved` boolean | Closes or reopens owner/admin question. | `question.controller.resolveQuestion` |
| POST | `/api/questions/:questionId/accept-answer/:answerId` | USER/ADMIN | Params: `questionId`, `answerId` | Accepts answer and closes question. | `question.controller.acceptAnswer` |
| DELETE | `/api/questions/:questionId/accept-answer/:answerId` | ADMIN | Params: `questionId`, `answerId` | Removes accepted marker when question is reopened. | `question.controller.unacceptAnswer` |

#### Answer APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| POST | `/api/questions/:questionId/answers` | USER/RESOLVER/ADMIN | Params: `questionId`; body: `body`, optional `references`, `attachments` | Adds answer to question and awards sparks. | `answer.controller.createAnswer` |
| PATCH | `/api/answers/:answerId` | USER/RESOLVER/ADMIN | Params: `answerId`; body: `body` | Edits answer; non-admin limited to 15 minutes and cannot edit accepted answers. | `answer.controller.updateAnswer` |
| DELETE | `/api/answers/:answerId` | USER/ADMIN | Params: `answerId`; optional `reason` | Soft-deletes answer. | `answer.controller.deleteAnswer` |
| POST | `/api/answers/:answerId/vote` | USER/RESOLVER/ADMIN | Params: `answerId`; body: `vote` as `up` or `down` | Votes, toggles, or flips answer vote. | `answer.controller.voteAnswer` |

#### Comment APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| POST | `/api/comments` | USER/RESOLVER/ADMIN | Body: `targetType: answer`, `targetId`, `body`, optional `parentId` | Adds comment or one-level reply to an answer. | `comment.controller.createComment` |
| GET | `/api/comments` | USER/RESOLVER/ADMIN | Query: `targetType`, `targetId`, `page`, `limit` | Lists comments for question/answer target; creation is answer-only. | `comment.controller.listComments` |
| PATCH | `/api/comments/:commentId` | USER/RESOLVER/ADMIN | Params: `commentId`; body: `body` | Edits comment; non-admin limited to 15 minutes. | `comment.controller.updateComment` |
| DELETE | `/api/comments/:commentId` | USER/ADMIN | Params: `commentId` | Soft-deletes comment. | `comment.controller.deleteComment` |

#### Admin APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| GET | `/api/admin/dashboard` | ADMIN | Query: optional `from`, `to` | Returns metrics, recent activity, charts, and 24-hour traffic. | `admin.controller.getAdminDashboard` |
| GET | `/api/admin/settings` | ADMIN | None | Returns platform settings with defaults merged. | `admin.controller.getAdminSettings` |
| PATCH | `/api/admin/settings/:section` | ADMIN | Params: `section`; body: settings payload | Updates `leaderboard`, `userThresholds`, or `questionEscalation`. | `admin.controller.updateAdminSettings` |
| POST | `/api/admin/settings/leaderboard/preview` | ADMIN | Body: `weights`, optional `limit` | Computes projected leaderboard ranking. | `admin.controller.previewLeaderboardWeights` |
| POST | `/api/admin/users/:userId/roles` | ADMIN | Params: `userId`; body: `role` | Assigns role. | `admin.controller.assignUserRole` |
| DELETE | `/api/admin/users/:userId/roles/:roleName` | ADMIN | Params: `userId`, `roleName` | Removes role, with final-admin guard. | `admin.controller.removeUserRole` |
| POST | `/api/admin/users` | ADMIN | Body: `name`, `email`, `password`, optional `role` | Creates user account and role mapping. | `admin.controller.createUser` |
| GET | `/api/admin/sparks/transactions` | ADMIN | Query: `page`, `limit`, `userId`, `type`, `from`, `to` | Audits spark ledger. | `admin.controller.listAdminSparkTransactions` |
| GET | `/api/admin/tags` | ADMIN | Query: page/limit behavior exists but controller currently passes request object incorrectly to `getPagination`; verify manually. | Lists tags. | `admin.controller.listTags` |
| POST | `/api/admin/tags` | ADMIN | Body: `name`, `description` | Creates tag. | `admin.controller.createTag` |
| PATCH | `/api/admin/tags/:tagName` | ADMIN | Params: `tagName`; body: `name` | Renames tag and updates questions. | `admin.controller.renameTag` |
| DELETE | `/api/admin/tags/:tagName` | ADMIN | Params: `tagName` | Deletes tag and pulls it from questions. | `admin.controller.deleteTag` |
| POST | `/api/admin/questions/:questionId/resolve` | ADMIN | Params: `questionId`; body: `body` | Posts official admin answer and resolves question. | `admin.controller.adminCommentAndResolve` |
| POST | `/api/admin/questions/:questionId/seek-approval` | ADMIN | Body: `adminId`, `adminName` | Requests higher-authority approval. | `admin.controller.adminSeekApproval` |
| POST | `/api/admin/questions/:questionId/approve-request` | ADMIN | Params: `questionId` | Target admin marks approval received. | `admin.controller.adminMarkApprovalReceived` |
| POST | `/api/admin/questions/:questionId/export-faq` | ADMIN | Body: `curatedTitle`, `curatedBody`, `tags` | Exports closed approved community question to FAQ. | `admin.controller.exportQuestionToFAQ` |

#### Flag and Moderation APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller |
|---|---|---|---|---|---|
| POST | `/api/flags` | USER/RESOLVER/ADMIN | Body: `targetType`, `targetId`, `reason`, optional `description` | Reports content and marks target pending. | `flag.controller.createFlag` |
| GET | `/api/flags` | ADMIN | Query: `page`, `limit`, `status`, `targetType`, `reason` | Lists flags with target/reporter/author names. | `flag.controller.listFlags` |
| PATCH | `/api/flags/:flagId/resolve` | ADMIN | Body: `status`, optional `action`, `resolutionNote` | Resolves flag and optionally hides/deletes/warns/suspends. | `flag.controller.resolveFlag` |
| GET | `/api/moderation/queue` | ADMIN | Query: `page`, `limit`, `status`, `targetType` | Lists pending moderation queue. | `moderation.controller.getModerationQueue` |
| PATCH | `/api/moderation/content` | ADMIN | Body: `targetType`, `targetId`, `action`, optional `reason` | Applies moderation action directly. | `moderation.controller.moderateContent` |
| POST | `/api/moderation/users/:userId/warn` | ADMIN | Body: `reason`, `message` | Sends warning notification. | `moderation.controller.warnUser` |

#### Notification, Spark, Leaderboard, Resolver, Dashboard APIs

| Method | Endpoint | Protected | Required body/params/query | Description | Controller/Service |
|---|---|---|---|---|---|
| GET | `/api/notifications` | USER/RESOLVER/ADMIN | Query: `page`, `limit`, `read`, `type` | Lists current user's notifications and unread count. | `notification.controller.listNotifications` |
| PATCH | `/api/notifications/read-all` | USER/RESOLVER/ADMIN | None | Marks all notifications read. | `notification.controller.markAllNotificationsRead` |
| PATCH | `/api/notifications/:notificationId/read` | USER/RESOLVER/ADMIN | Params: `notificationId` | Marks one notification read. | `notification.controller.markNotificationRead` |
| GET | `/api/sparks/balance` | USER/RESOLVER/ADMIN | None | Returns spark balance and reputation. | `spark.controller.getSparkBalance` |
| GET | `/api/sparks/transactions` | USER/RESOLVER/ADMIN | Query: `page`, `limit`, `type`, `from`, `to` | Lists current user's spark transactions. | `spark.controller.listSparkTransactions` |
| GET | `/api/leaderboard` | USER/RESOLVER/ADMIN | Query: `type`, `role`, `limit`, `window` | Returns `reputation`, `spark`, or `acceptedAnswers` leaderboard. | `spark.controller.getLeaderboard` |
| GET | `/api/resolver/questions` | RESOLVER/ADMIN | Query: `category`, `tag`, `unanswered`, `sort`, pagination | Resolver queue. | `resolver.controller.getResolverQueue` |
| GET | `/api/resolver/stats` | RESOLVER/ADMIN | Query: `from`, `to` | Resolver stats. | `resolver.controller.getResolverStats` |
| PATCH | `/api/resolver/expertise` | RESOLVER/ADMIN | Body: arrays `expertise`, `categories`, `tags` | Updates resolver expertise fields. | `resolver.controller.updateResolverExpertise` |
| GET | `/api/dashboard/events` | USER/RESOLVER/ADMIN | Query: optional `my=1` | Server-Sent Events for dashboard question vote updates. | `dashboard-events.service.registerDashboardEvents` |

### 8. Frontend Pages and Components

| Page/Component | Route | Purpose | Related API |
|---|---|---|---|
| Landing | `/` | Public FAQ browser, tag navigation, search, login modal. | `GET /api/faqs`, `GET /api/auth/me` |
| LoginModal | Modal on `/` | Login form and frontend-only forgot-password message. | `POST /api/auth/login` |
| ProtectedRoute | Route wrapper | Redirects unauthenticated users and enforces admin/non-admin routes. | Auth store populated by `/api/auth/me` |
| UserLayout | Protected shell | User sidebar/header, notifications, search/tag state, dark mode, onboarding. | `/api/notifications`, `/api/questions/tags`, `/api/auth/logout` |
| DashboardPage | `/dashboard` | Lists community questions, tabs, filters, upvote, contributions widget, SSE refresh. | `/api/questions`, `/api/questions/counts`, `/api/questions/:id/vote`, `/api/dashboard/events`, `/api/users/:id/contributions` |
| RaiseQueryPage | `/raise-query` | Create query with category, title, markdown description, anonymity, attachments, similar cached queries. | `GET /api/questions/tags`, `POST /api/questions` |
| QueryDetailPage | `/query/:queryId` | Question detail, answers, comments, votes, accept/resolve, reports, attachments, markdown preview. | `/api/questions/:id`, `/api/questions/:id/view`, `/api/questions/:id/answers`, `/api/answers/:id/vote`, `/api/comments`, `/api/flags` |
| ProfileSettingsPage | `/profile` | Display-name update and password change. | `/api/profile/me`, `/api/profile/password` |
| MyContributionsPage | `/my-contributions` | User contribution feed and stats. | `/api/users/me/contributions` |
| LeaderboardPage | `/leaderboard` | User leaderboard tabs for spark, reputation, accepted answers. | `/api/leaderboard` |
| AdminHome | `/admin/*` | Admin shell with sidebar/header, notifications, dark mode, onboarding, view switching by path. | `/api/admin/dashboard`, `/api/notifications`, `/api/auth/logout` |
| Admin Dashboard | `/admin/dashboard` | KPI cards, unresolved queries, charts, recent traffic. | `/api/admin/dashboard`, `/api/questions?status=unanswered` |
| Queries Management | `/admin/queries` | Search and filter all questions by status/kind/expert/approval/id. | `/api/questions` |
| Admin Query Detail | `/admin/queries/:questionId` | Review question, see answers/comments, respond as admin, seek approval, mark approval, export to FAQ. | `/api/questions/:id`, `/api/admin/questions/:id/resolve`, `/seek-approval`, `/approve-request`, `/export-faq` |
| FAQ Management | `/admin/faqs` | Create/edit/delete FAQs, tag management, markdown preview. | `/api/questions?kind=faq`, `/api/questions`, `/api/admin/tags` |
| User Management | `/admin/users` | Search/filter users, create user, toggle roles, update status. | `/api/users`, `/api/admin/users`, `/api/admin/users/:id/roles`, `/api/users/:id/status` |
| Flag Moderation | `/admin/flags` | Moderation queue/all flags, review modal, hide/dismiss actions. | `/api/moderation/queue`, `/api/flags`, `/api/flags/:id/resolve` |
| Spark Leaderboard | `/admin/spark` | Spark leaderboard with all/month/today filters and search. | `/api/leaderboard?type=spark` |
| Settings | `/admin/settings` | Leaderboard weights, thresholds, escalation settings, preview impact. | `/api/admin/settings`, `/api/admin/settings/:section`, `/api/admin/settings/leaderboard/preview` |
| Admin Profile | `/admin/profile` | Admin display-name and password settings. | `/api/profile/me`, `/api/profile/password` |
| AnswerComments | Nested under query detail | Comment and one-level reply UI for answers. | `/api/comments` |
| ReportModal | Nested under query detail | Report question/answer/comment content. | `/api/flags` |
| Notification sidebars | User/admin layouts | Display notifications and mark all read. | `/api/notifications`, `/api/notifications/read-all` |

### 9. Authentication and Authorization

Login is implemented through `POST /api/auth/login`. The backend normalizes the email, fetches the user with `passwordHash`, verifies the password using argon2, checks the account status, resolves roles from `roles` and `user_role_mappers`, optionally awards a daily login spark, updates `last_login_at`, and sets a cookie named `token`.

The token is generated in `backend/src/utils/auth-token.js`. It is JWT-shaped (`header.payload.signature`) and signed with HMAC SHA-256 using `JWT_SECRET`. It includes `iat` and `exp`, with a default TTL of 7 days.

Frontend session behavior:

| Concern | Implementation |
|---|---|
| Session bootstrap | `frontend/src/App.jsx` calls `GET /api/auth/me` on load. |
| Cookie sending | `axisPrivate()` in `frontend/src/api/axios.jsx` uses `withCredentials: true`. |
| User state | `useAuthStore` persists the user object in localStorage key `rogare-auth`. |
| Token storage | The frontend does not store the token directly; the backend sets an HTTP-only cookie. |
| Unauthorized handling | Axios interceptor clears session on 401 or account-disabled 403 and redirects to `/`. |
| Frontend authorization | `ProtectedRoute` requires login and checks `requiredRole`. Admins are redirected away from user routes. |
| Backend authorization | `verifyToken` populates `req.user`; `checkRole` enforces roles on protected routes. |
| Role model | Roles are separate documents mapped through `UserRoleMapper`; primary role priority is ADMIN > RESOLVER > USER. |

Visible security limitations and notes:

| Item | Observation |
|---|---|
| Refresh tokens | No refresh-token flow was found. |
| CSRF protection | Login uses an HTTP-only cookie with `sameSite: 'lax'`; no explicit CSRF token middleware was found. |
| Rate limiting | Global API limiter, login limiter, signup limiter, and question creation limiter are implemented. |
| Password reset | Frontend displays a reset-link message, but no backend password-reset endpoint was found. |
| Input sanitization | Markdown output is sanitized on the frontend with DOMPurify. Backend sanitization beyond validation/manual checks is limited. |
| Token standard library | Token signing is custom code rather than a library such as `jsonwebtoken`. |
| Swagger drift | `openapi.paths.js` includes `/api/auth/register` and `/api/auth/admin/login`, but those aliases are not mounted in `auth.routes.js`. |

### 10. Environment Variables

Tracked example files:

| Variable | Used In | Purpose |
|---|---|---|
| `PORT` | `backend/src/server.js`, `backend/.env.example` | Backend listen port, default 5000. |
| `MONGO_URI` | `backend/src/config/db.js`, `backend/.env.example` | MongoDB connection string fallback. |
| `JWT_SECRET` | `backend/src/utils/auth-token.js`, `backend/.env.example` | HMAC signing secret for auth tokens. |
| `NODE_ENV` | Backend auth/cookie/error/db config | Production cookie security, error stack behavior, DB TLS behavior, test detection. |
| `ALLOWED_ORIGINS` | `backend/src/app.js`, `backend/.env.example` | Comma-separated CORS allowlist. |
| `VITE_API_BASE_URL` | `frontend/src/api/axios.jsx`, `frontend/.env.example`, frontend pages | Frontend API base URL. |

Additional environment variables used in code but not listed in the tracked examples:

| Variable | Used In | Purpose |
|---|---|---|
| `MONGODB_URI` | `backend/src/config/db.js` | Preferred MongoDB connection string. |
| `DATABASE_URL` | `backend/src/config/db.js` | Additional MongoDB URI fallback. |
| `MONGO_URI_FAQ` | `backend/src/config/db.js` | Optional separate FAQ database URI. |
| `MONGODB_DB_NAME` | `backend/src/config/db.js` | Optional Mongoose `dbName`. |
| `MONGODB_TLS` | `backend/src/config/db.js` | Enables TLS explicitly. |
| `MONGODB_USE_CUSTOM_DNS` | `backend/src/config/db.js` | Enables custom DNS in DB config. |
| `VITE_API_PROXY_TARGET` | `frontend/vite.config.js` | Development proxy target for `/api`, default `http://localhost:5000`. |

Actual `.env` files exist locally under `backend/.env` and `frontend/.env`, but they are ignored by git. `git ls-files` shows only `.env.example` files are tracked. No real secret values are printed in this document.

### 11. Installation and Setup

#### Prerequisites

| Tool | Required because |
|---|---|
| Node.js 20+ | Both `frontend/package.json` and `backend/package.json` declare `node >=20`. |
| npm | Lockfiles are `package-lock.json`; scripts use npm. |
| MongoDB or MongoDB Atlas | Backend uses Mongoose and requires a Mongo connection string. |

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill backend `.env` with values like:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vicharanashala
JWT_SECRET=<replace-with-secret>
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Useful backend scripts from `backend/package.json`:

```bash
npm run dev
npm start
npm test
npm run seed:admin
npm run recompute:reputation
npm run rebuild:votes
npm run rebuild:question-counters
npm run rebuild:comment-counters
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Useful frontend scripts from `frontend/package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run preview
```

#### Running Both Locally

The repository includes:

```bash
./run-dev.sh
```

That script starts the backend on `http://localhost:5000` and the frontend dev server on `http://localhost:5173`.

### 12. Testing and Verification

Automated backend tests exist under `backend/src/tests/` and are run with:

```bash
cd backend
npm test
```

Test framework: Node's built-in `node:test` with `node:assert/strict`.

Test coverage visible in the repository includes:

| Test file | Coverage area |
|---|---|
| `auth.controller.test.js` | Password strength validation. |
| `question-counts.test.js` | Question base filter behavior and status mapping. |
| `notification.model.test.js` | Notification schema type support for moderation notifications. |
| `moderation-action.test.js` | Content moderation action behavior. |
| `export-faq.test.js` | FAQ export validation and success flow. |
| `admin-names.test.js` | Flag target display-name resolution and moderation action behavior. |
| `platform-settings.test.js` | Platform setting merge/sanitization validation. |
| `question-status.test.js` | Open/resolved status mapping. |
| `question-view.test.js` | Unique question view counting. |

Frontend has lint/typecheck/build scripts but no frontend automated test files were found.

Suggested manual testing checklist based on implemented features:

| Area | Manual check |
|---|---|
| Authentication | Login with valid user; verify `/api/auth/me` bootstrap; logout; blocked protected route redirects. |
| Registration | Test backend `POST /api/auth/signup` directly because no frontend signup page was found. |
| FAQ browsing | Open `/`, verify published FAQs load, search filters, tag navigation, expand/collapse. |
| Submit FAQ/admin | Admin creates, edits, deletes FAQ; public landing updates after query invalidation/reload. |
| Submit question | User raises query with category, markdown, anonymous toggle, and allowed attachments. |
| View question list | Verify dashboard tabs: All, Trending, Recent, Unanswered, Resolved; tag and search filters. |
| Question detail | View thread, attachments preview/download, record view, related queries. |
| Answer/comment | Add answer, vote answer, add comment and one-level reply, edit/delete within allowed window. |
| Resolve flow | Owner marks resolved/reopened; accepts answer; admin response resolves question. |
| Reporting/moderation | Report content, admin reviews flag, uphold hides content, dismiss leaves it visible. |
| Admin user management | Create user, assign/remove roles, change account status. |
| Admin approval/export | Seek approval, target admin marks approval received, export closed approved question to FAQ. |
| Unauthorized access | Non-admin access to `/admin/*`; admin access to user routes; disabled account behavior. |
| Settings | Update leaderboard weights, preview impact, update escalation settings. |

### 13. GitHub Workflow and Contributions

Local Git history is available. The current checked-out branch is `main` tracking `origin/main`, and `git status --short` was clean before creating this documentation file.

Recent commits indicate a PR-based workflow and scoped feature/fix commits:

| Commit | Summary |
|---|---|
| `6d74d09a` | `fix(dashboard): combine answers and comments in metrics visualization` |
| `fcc16f59` | `fix(routes): block ADMINs from accessing user self-service routes` |
| `a2e02622` | Merge PR adding TS/backend ESLint tooling |
| `3b3c4ce3` | `chore: add TS type-checking, backend ESLint, and repo hygiene` |
| `bda863be` | `security: protect user/backend routes from admin access and vice versa` |
| `c2612483` | `security: require approval+resolution before FAQ export` |
| `ee0d8674` | `feat(admin): escalation workflow, dashboard approval card, SLA & community charts (#113)` |
| `0cdbbc43` | `feat: implement query attachments preview and download for student and admin dashboards (#105)` |

Contribution names listed in the root README:

| Team Member | Contribution |
|---|---|
| Samyabrata Roy | Not clearly identifiable from the current codebase. |
| Nandini | Not clearly identifiable from the current codebase. |
| SAMAD MOHAMMED | Not clearly identifiable from the current codebase. |
| Ansh Varshney | Not clearly identifiable from the current codebase. |
| Kashish Panwar | Not clearly identifiable from the current codebase. |
| Shreya Choudhary | Not clearly identifiable from the current codebase. |
| Rahul Prasad | Not clearly identifiable from the current codebase. |
| Abhi Sriya | Not clearly identifiable from the current codebase. |
| Adhin Mahesh | Not clearly identifiable from the current codebase. |
| Udarsh Goyal | Not clearly identifiable from the current codebase. |

The repository includes `.github/PULL_REQUEST_TEMPLATE.md` and `CONTRIBUTING.md`, both requiring summaries, scope, testing notes, reviewer notes, screenshots for UI changes, and checklist items such as checking for secrets.

### 14. Challenges Faced

The following challenges are inferred from implemented code, comments, tests, and recent commit history:

| Challenge | Evidence in codebase |
|---|---|
| Frontend-backend authentication integration | Cookie-based login, `/api/auth/me` bootstrap, Axios interceptor, and route guards span `App.jsx`, `axios.jsx`, `ProtectedRoute.jsx`, and backend auth middleware. |
| Role-based access separation | Recent commits and code block admins from user self-service routes and guard admin endpoints with `checkRole('ADMIN')`. |
| FAQ export correctness | Tests and controller guards require a question to be closed and approval received before export. |
| Moderation state consistency | Flag creation marks targets pending; hidden/deleted content is redacted/tombstoned for users; admins can still review. |
| Counter/cache consistency | Vote, answer, comment, spark, and view counters are cached, with rebuild scripts and tests guarding behavior. |
| Attachment storage limits | Attachments are embedded in question documents, with code guarding per-file and total size because of MongoDB document limits. |
| Admin dashboard metrics | Dashboard combines aggregations across users, questions, flags, sparks, tags, answers, comments, and time buckets. |
| Scheduled assignment/escalation | Cron must avoid overlapping runs, handle no active resolvers/admins, log feature events, and notify assignees. |
| Documentation drift | Swagger paths include auth aliases not found in actual route files; README/context contain some older statements that differ from current code. |

### 15. Limitations

| Limitation | Evidence |
|---|---|
| No frontend registration page | Backend `POST /api/auth/signup` exists, but no register page/component was found. |
| Password reset not implemented server-side | Login modal shows a reset message, but no backend reset route was found. |
| No refresh token flow | Auth token has fixed 7-day expiry; no refresh endpoint/model exists. |
| CSRF protection is limited | HTTP-only cookie uses sameSite `lax`, but no explicit CSRF token middleware was found. |
| Resolver APIs lack a dedicated frontend route | Backend has `/api/resolver/*`, but React routes do not include a resolver dashboard. |
| Comment creation is answer-only | `createComment` rejects targets other than `answer`, though `listComments` can list question or answer targets. |
| Comment vote model exists, but no comment vote route was found | `Vote` supports comments and `Comment` has vote counters, but routes/controllers do not expose comment voting. |
| Question edit/delete UI is limited | Backend supports owner/admin update/delete, but user query detail does not expose edit/delete for the original question. |
| FAQ search is client-side on loaded data | Public landing filters already-loaded FAQ sections rather than querying a backend search endpoint. |
| No frontend automated tests found | Frontend has lint, typecheck, and build scripts only. |
| Swagger docs have route drift | `/api/auth/register` and `/api/auth/admin/login` appear in `openapi.paths.js` but are not mounted in `auth.routes.js`. |
| `backend/src/dns-init.js` always sets DNS servers | `server.js` imports it before DB config; DB config has a conditional DNS setting too. This may be environment-sensitive. |
| Deployment config is not explicit | No platform-specific deployment files were found. |
| Admin tag list pagination code may need verification | `admin.controller.listTags` calls `getPagination(req)` instead of `getPagination(req.query)`, unlike other controllers. |

### 16. Future Enhancements

| Enhancement | Why it fits the current implementation |
|---|---|
| Add a frontend signup flow | Backend registration already exists. |
| Implement password reset | Frontend already has a forgot-password UI state. |
| Add refresh-token or session renewal | Current token uses fixed expiry only. |
| Add CSRF protection for cookie-authenticated state-changing requests | Auth uses HTTP-only cookies. |
| Build resolver dashboard | Resolver APIs, expertise fields, and assignment logs already exist. |
| Add duplicate FAQ/question detection | Current similar-query UI uses cached dashboard questions only. |
| Add full-text search endpoints and pagination for public FAQs | FAQ landing currently filters client-side. |
| Add comment voting | Models already include comment vote counters. |
| Add question edit/delete UI for owners | Backend already supports update/delete. |
| Add frontend automated tests | Frontend currently relies on lint/typecheck/build and manual checks. |
| Harden Swagger generation against route drift | Some documented auth aliases are not mounted. |
| Add production deployment documentation | Environment usage exists, but platform config is not present. |
| Add email notifications | Notifications are currently in-app only. |
| Store large attachments externally | Question attachments are embedded in MongoDB documents with explicit size guards. |

### 17. Screenshots Placeholder

Add screenshots later under `docs/screenshots/`.

```md
![Home Page](./docs/screenshots/home.png)

![Login Page](./docs/screenshots/login.png)

![Register Page](./docs/screenshots/register.png)

![FAQ Listing Page](./docs/screenshots/faq-listing.png)

![FAQ Detail Page](./docs/screenshots/faq-detail.png)

![Submit FAQ Page](./docs/screenshots/submit-faq.png)

![User Dashboard](./docs/screenshots/user-dashboard.png)

![Raise Query Page](./docs/screenshots/raise-query.png)

![Query Detail Page](./docs/screenshots/query-detail.png)

![Admin Dashboard](./docs/screenshots/admin-dashboard.png)

![Admin FAQ Management](./docs/screenshots/admin-faq-management.png)

![Admin Flag Moderation](./docs/screenshots/admin-flag-moderation.png)
```

Note: a frontend register page was not found, so the register screenshot placeholder should either be filled after implementing that page or omitted from final submission.

### 18. Conclusion

The repository successfully implements a full-stack FAQ and community question-resolution portal with a React/Vite frontend, Express/Mongoose backend, MongoDB data models, cookie-based authentication, role-based authorization, moderation, notifications, spark/reputation scoring, admin dashboards, and FAQ curation/export.

The implementation demonstrates MERN concepts including SPA routing, protected frontend routes, API service layers, Express route/controller organization, Mongoose schemas, authentication middleware, role mapping, file upload handling, background scheduling, and database-backed moderation workflows.

The portal can be improved further by adding frontend registration and password reset, exposing resolver workflows in the UI, adding frontend automated tests, reducing Swagger drift, and hardening production security and deployment documentation.

---

## Generation Summary and Manual Follow-Up

Generated sections:

| Section | Status |
|---|---|
| Project Overview | Completed from implemented code and repo metadata. |
| Technology Stack | Completed from package/config files. |
| Repository Structure | Completed from actual file tree. |
| System Architecture | Completed from frontend/backend data flow. |
| Features Implemented | Completed with file references. |
| Database Design | Completed from Mongoose model files. |
| API Documentation | Completed from actual route files/controllers. |
| Frontend Pages and Components | Completed from routes, pages, and service files. |
| Authentication and Authorization | Completed from auth/token/middleware/store code. |
| Environment Variables | Completed from examples and code usage, without secret values. |
| Installation and Setup | Completed from package scripts and env examples. |
| Testing and Verification | Completed from test files and scripts. |
| GitHub Workflow and Contributions | Completed from local git history and repo docs; individual contributions remain unclear. |
| Challenges, Limitations, Future Enhancements | Completed from code evidence and visible gaps. |
| Screenshots Placeholder | Completed with placeholder paths. |
| Conclusion | Completed. |

Manual information still needed:

| Item | Reason |
|---|---|
| Actual screenshots | No screenshot files were provided/found under `docs/screenshots/`. |
| Individual team member contribution mapping | Names exist in README, but contribution areas are not clearly attributable from current codebase alone. |
| Production deployment steps | No explicit deployment platform config was found. |
| Frontend registration status | Backend signup exists, but the frontend register page is absent. |
