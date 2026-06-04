# Settings

Admin view for managing platform-wide configuration — leaderboard weights, resolver
eligibility thresholds, moderation thresholds, and question escalation rules.
Settings are persisted in the singleton `platform_settings` MongoDB collection.

- **Component:** [`index.jsx`](./index.jsx) — `SettingsView`
- **Rendered by:** [`pages/admin/index.jsx`](../../index.jsx) when
  `currentAdminView === 'settings'`.

## Data

```ts
fetchAdminSettings()                    → GET    /api/admin/settings
updateAdminSettingsSection(key, value)  → PATCH  /api/admin/settings  { key, value }
previewLeaderboardWeights(weights)      → POST   /api/admin/settings/preview  { weights }
```

All endpoints require `ADMIN` role. Service: [`pages/admin/service.js`](../../service.js).

## Sections

The page is divided into collapsible panels. Each section saves independently via
`updateAdminSettingsSection(key, value)` where `key` is the section name.

| Section | `key` | What it controls |
|---------|-------|-----------------|
| **Leaderboard Weights** | `leaderboard` | Per-component weight for leaderboard scoring: questions asked, answers given, comments, accepted resolutions, upvotes received, resolver activity, spark points, reputation, warning penalty |
| **Leaderboard Preview** | — | Live preview of top-5 leaderboard scores computed with the current weight set |
| **Resolver Eligibility** | `userThresholds.resolverEligibility` | Minimum criteria to become a resolver: min answers/comments, upheld contributions, successful resolver actions, accepted resolutions, reputation score, spark points |
| **Moderation Thresholds** | `userThresholds.moderationThresholds` | Flags before review, warnings before inactive, auto-deactivate on threshold, inactivity days |
| **Escalation Settings** | `questionEscalation` | Hours to escalate, auto-escalation toggle, reminder hours, assignment strategy (`any_admin` / `round_robin_admin` / `default_admin`), default admin user ID |

## Leaderboard Preview

`previewLeaderboardWeights` sends the current weight object to the backend which
applies it to the `UserProfile` aggregation and returns ranked top-5 with scores.
This runs on every weight change (debounced) so the admin can see the impact before
saving.

## State

| State | Purpose |
|-------|---------|
| `settings` | Full `PlatformSettings` object (lazy-loaded on mount) |
| `loading` | Initial settings fetch |
| `saving` | Per-section save in flight (section button disabled) |
| `activeSection` | Which panel is expanded (`'leaderboard'` \| `'resolverEligibility'` \| …) |

## Feedback

Save uses `notifySuccess` / `notifyError`. The preview updates on every weight
change but does not auto-save — explicit save is required.

## Not implemented

- **Hard delete / restore** on user accounts — deletion is soft only; no un-delete in this UI.
- **Per-tag** escalation rules — escalation settings apply globally.