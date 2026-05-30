# Rogāre Backend — File Structure

```
backend/
├── .env                         # Environment variables (PORT, MONGODB_URI, JWT_SECRET, ALLOWED_ORIGINS)
├── .env.example                 # Sample env vars
├── .gitignore
├── ER_DIAGRAM.md                # Entity-relationship diagram
├── package.json
├── package-lock.json
└── src/
    ├── server.js                # Entry point — starts HTTP server
    ├── app.js                   # Express app — middleware, CORS, routes, Swagger
    │
    ├── config/
    │   ├── db.js                # MongoDB connection (Mongoose)
    │   ├── swagger.js           # Swagger/OpenAPI setup
    │   ├── openapi-components.js
    │   └── openapi-paths.js
    │
    ├── controllers/             # Route handlers — business logic
    │   ├── admin.controller.js
    │   ├── answer.controller.js
    │   ├── auth.controller.js   # Login, logout, register, forgot/reset password
    │   ├── comment.controller.js
    │   ├── flag.controller.js   # Report/flag content pipeline
    │   ├── moderation.controller.js
    │   ├── notification.controller.js
    │   ├── profile.controller.js
    │   ├── question.controller.js # CRUD for questions + search + tags
    │   ├── resolver.controller.js
    │   ├── spark.controller.js   # Spark points transactions
    │   ├── user.controller.js    # User listing, status, contributions
    │   └── README.md
    │
    ├── middleware/
    │   ├── authMiddleware.js    # JWT verify, verifyToken, checkRole
    │   └── error.middleware.js  # Global error handler, 404 handler
    │
    ├── models/                  # Mongoose schemas
    │   ├── answer.model.js
    │   ├── comment.model.js
    │   ├── flag.model.js
    │   ├── notification.model.js
    │   ├── question-assignment-log.model.js
    │   ├── question.model.js
    │   ├── role.model.js
    │   ├── spark-transaction.model.js
    │   ├── user-profile.model.js
    │   ├── user-role-mapper.model.js
    │   ├── user.model.js
    │   └── vote.model.js
    │
    ├── routes/                  # Express routers — URL mapping to controllers
    │   ├── admin.routes.js
    │   ├── answer.routes.js
    │   ├── auth.routes.js
    │   ├── comment.routes.js
    │   ├── flag.routes.js
    │   ├── leaderboard.routes.js
    │   ├── moderation.routes.js
    │   ├── notification.routes.js
    │   ├── profile.routes.js
    │   ├── question.routes.js
    │   ├── resolver.routes.js
    │   ├── spark.routes.js
    │   └── user.routes.js
    │
    ├── services/                # Business logic layer
    │   ├── content.service.js
    │   ├── question-allocation.service.js
    │   ├── role.service.js
    │   └── spark.service.js      # Spark points award/deduct logic
    │
    ├── scheduled/
    │   └── question-assignment.js  # Cron/scheduled question auto-assignment
    │
    ├── scripts/                 # One-off seed / migration / rebuild scripts
    │   ├── ingest-faqs.js
    │   ├── seed-admin.js
    │   ├── seed-all.js          # Seeds roles, users, FAQs, discussions, answers, comments, spark txns
    │   ├── rebuild-comment-counters.js
    │   ├── rebuild-question-counters.js
    │   ├── rebuild-vote-counters.js
    │   ├── recompute-reputation.js
    │   └── migrations/
    │       ├── 001-backfill-user-role-mappers.js
    │       ├── 002-migrate-profile-identity.js
    │       ├── 003-migrate-expert-profile-fields.js
    │       ├── 004-migrate-upvoted-by-to-votes.js
    │       ├── 005-reconcile-spark-points.js
    │       └── 006-backfill-question-assignment-log-ids.js
    │
    └── utils/
        ├── auth-token.js        # Token signing / verification helpers
        ├── featureLogger.js
        └── http.js              # Shared HTTP utility helpers (createHttpError, etc.)
```

## Key Design Notes

### Question Model — Dual Type
One `questions` collection serves both surfaces, discriminated by `kind`:
- `kind: 'faq'` — published FAQ; must have exactly 1 answer before publishing
- `kind: 'community'` — open Discussion; normal Q&A flow (Active → Answered → Resolved)

### User Roles
- `USER` — standard student
- `RESOLVER` — can answer, moderate
- `ADMIN` — full access, user management

Many-to-many mapping via `UserRoleMapper`.

### Gamification — Spark Points
Spark system tracks engagement:
- Ask a question: +2 sparks
- Submit answer: +5 sparks
- Answer accepted: +15 sparks
- Daily login: +1 spark
- Bonus/penalty by moderators

### Moderation Pipeline
`flag` → `pending_review` → `reviewed` → `action_taken` (warn/remove/suspend)

## API Base
All routes under `/api/`. Authenticated routes require `Authorization: Bearer <token>` header (HttpOnly cookie `token` also set on login).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `ALLOWED_ORIGINS` | CORS whitelist (comma-separated) |
| `NODE_ENV` | `development` or `production` |

## Key API Endpoints

### Profile (used by AdminProfileView)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get current user's profile |
| PATCH | `/api/profile/me` | Update displayName, bio, etc. |
| PATCH | `/api/profile/password` | Change password (requires current + new) |