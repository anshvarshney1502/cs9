# Backend File Structure

```
backend/
├── src/
│   ├── app.js
│   ├── db.js
│   ├── server.js
│   ├── swagger.js
│   ├── openapi-components.js
│   └── openapi-paths.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js           ← includes seek-approval / approve-request
│   │   ├── answer.controller.js
│   │   ├── auth.controller.js
│   │   ├── comment.controller.js
│   │   ├── flag.controller.js
│   │   ├── moderation.controller.js
│   │   ├── notification.controller.js
│   │   ├── profile.controller.js
│   │   ├── question.controller.js        ← includes hasApproval filter
│   │   ├── resolver.controller.js
│   │   ├── spark.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── answer.model.js
│   │   ├── approval.model.js             ← admin escalation tracking
│   │   ├── comment.model.js
│   │   ├── faq.model.js
│   │   ├── flag.model.js
│   │   ├── notification.model.js
│   │   ├── platform-settings.model.js
│   │   ├── question-assignment-log.model.js
│   │   ├── question.model.js
│   │   ├── question_view.model.js        ← per-user view tracking (unique views)
│   │   ├── role.model.js
│   │   ├── spark-transaction.model.js
│   │   ├── tag.model.js
│   │   ├── user-profile.model.js
│   │   ├── user-role-mapper.model.js
│   │   ├── user.model.js
│   │   └── vote.model.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── answer.routes.js
│   │   ├── auth.routes.js
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js           ← dashboard aggregation
│   │   ├── flag.routes.js
│   │   ├── leaderboard.routes.js
│   │   ├── moderation.routes.js
│   │   ├── notification.routes.js
│   │   ├── profile.routes.js
│   │   ├── question.routes.js
│   │   ├── resolver.routes.js
│   │   ├── spark.routes.js
│   │   └── user.routes.js
│   │
│   ├── scheduled/
│   │   └── question-assignment.js
│   │
│   ├── scripts/
│   │   ├── migrations/
│   │   │   ├── 002-migrate-profile-identity.js
│   │   │   ├── 003-migrate-expert-profile-fields.js
│   │   │   ├── 004-migrate-upvoted-by-to-votes.js
│   │   │   ├── 005-reconcile-spark-points.js
│   │   │   └── 006-backfill-question-assignment-log-ids.js
│   │   ├── ingest-faqs.js
│   │   ├── rebuild-comment-counters.js
│   │   ├── rebuild-question-counters.js
│   │   ├── rebuild-vote-counters.js
│   │   ├── recompute-reputation.js
│   │   ├── seed-admin.js
│   │   └── seed-all.js
│   │
│   ├── services/
│   │   ├── content.service.js
│   │   ├── dashboard-events.service.js  ← SSE real-time event push
│   │   ├── domain-events.service.js     ← shared event bus (used by dashboard + notifications)
│   │   ├── question-allocation.service.js
│   │   ├── role.service.js
│   │   └── spark.service.js
│   │
│   └── utils/
│       ├── auth-token.js
│       ├── featureLogger.js
│       └── http.js
│
└── package.json
```