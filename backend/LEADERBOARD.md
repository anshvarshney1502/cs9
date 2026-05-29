# Leaderboard & Scoring

`GET /api/leaderboard` ranks users by one of three factors. Pick the factor with the
`type` query param; results are returned pre-sorted (highest first).

```
GET /api/leaderboard?type=spark|reputation|acceptedAnswers&role=USER|RESOLVER|ADMIN&limit=20
→ { success: true, leaderboard: [{ userId, displayName, score }] }
```

- `type`  — ranking factor (default `reputation`). Invalid value → 400.
- `role`  — optional; restrict to a single role.
- `limit` — max rows (default 20).

Handler: [`getLeaderboard`](src/controllers/spark.controller.js).
Scoring rules: [`spark.service.js`](src/services/spark.service.js).

---

## 1. Spark Points (`type=spark`)

**What it is:** the platform's engagement *currency*. The source of truth is the
append-only `spark_transactions` ledger. `User.spark_points` is a cached balance maintained
by `spark.service.js` and the reconciliation script.

**It rewards participation of every kind** — showing up, asking, answering, and being
useful. Award values are defined in `SPARK_POINTS` in `spark.service.js`.

| Action | Points |
|--------|--------|
| `DAILY_LOGIN` | +1 |
| `SUBMIT_QUESTION` | +2 |
| `SUBMIT_ANSWER` | +5 |
| `ANSWER_UPVOTED` | +3 |
| `ADD_REFERENCE` | +5 |
| `ANSWER_ACCEPTED` | +15 |
| `EXPERT_VERIFIED` | +20 |
| `QUESTION_BOUNTY` | −(bounty) when a bounty is reserved |
| `BOUNTY_AWARDED` | +(bounty) to the answer author when accepted |

**Query:** `User.find().sort({ spark_points: -1 })`. If drift is suspected, run the
dry-run reconciliation first:

```sh
node src/scripts/migrations/005-reconcile-spark-points.js --dry-run
```

---

## 2. Accepted Answers (`type=acceptedAnswers`)

**What it is:** how many of a user's answers were marked as the **accepted solution** to a
question. A pure "top resolver / most helpful" metric.

**How it's computed:** a live aggregation over the `answers` collection — no stored
counter, so it's always current:

```js
Answer.aggregate([
  { $match: { is_accepted: true, is_deleted: { $ne: true } } },
  { $group: { _id: '$author_id', score: { $sum: 1 } } },
  { $sort: { score: -1 } },
])
```

**Note:** narrow by design — only users with at least one accepted answer appear. New or
purely-active users won't rank here until an answer of theirs is accepted.

---

## 3. Reputation (`type=reputation`)

**What it is:** a **trust / quality** signal, distinct from spark. Where spark rewards *any*
activity (including just logging in), reputation only moves when the community validates
your contributions. Stored on `UserProfile.reputation`.

**How it's earned** — `REPUTATION_POINTS` in `spark.service.js`, applied inside
`awardSpark()` alongside the spark award:

| Action | Reputation |
|--------|-----------|
| `ANSWER_UPVOTED` | +10 |
| `ANSWER_ACCEPTED` | +15 |
| `EXPERT_VERIFIED` | +50 |

Logging in, asking questions, or posting an answer that nobody upvotes does **not** raise
reputation — only peer/expert validation does.

**Query:** `UserProfile.find().sort({ reputation: -1 })`.

### Backfill (one-time)

Reputation began as an unused field. After enabling it, run the backfill once to seed
historical values from existing answers; new activity then accrues automatically:

```sh
npm run recompute:reputation
```

Formula used by [`recompute-reputation.js`](src/scripts/recompute-reputation.js), mirroring
the live increments:

```
reputation = (accepted answers × 15) + (total answer upvotes × 10)
```

---

## Spark vs. Reputation — at a glance

| | Spark Points | Reputation |
|---|---|---|
| Measures | Engagement / activity | Trust / answer quality |
| Earned from logging in? | Yes (+1/day) | No |
| Earned from asking? | Yes (+2) | No |
| Earned from being upvoted/accepted? | Yes | Yes (only these) |
| Stored on | `User.spark_points` cache backed by `spark_transactions` | `UserProfile.reputation` |
| Spendable (bounties)? | Yes | No |
