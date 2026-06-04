# Admin Profile

Admin's own profile view — display name, avatar (read-only upload stub), and
password change. Shares the user-side `fetchProfile` / `updateProfile` endpoints
with a slightly different layout shell.

- **Component:** [`index.jsx`](./index.jsx) — `AdminProfileView`
- **Rendered by:** [`pages/admin/index.jsx`](../../index.jsx) when
  `currentAdminView === 'adminProfile'`.
- **Nav:** last item in the admin LeftPane ("Profile").

## Data

```ts
fetchProfile()              → GET    /api/profile             → { displayName, avatarUrl, ... }
updateProfile({ displayName })  → PATCH /api/profile         { displayName }
changePassword(cur, next)   → POST   /api/auth/change-password  { currentPassword, newPassword }
```

`fetchProfile` reads the acting admin's `UserProfile` document. `updateProfile`
persists `displayName` back to it. Password change is separate — both fields are
required (current + new); if both are blank the change is skipped.

The `user` object in the auth store (`useAuthStore`) is updated on save so the
avatar initials and name in the admin header reflect the change immediately.

## State

| State | Default | Description |
|-------|---------|-------------|
| `name` | `user?.name` | Editable display name |
| `currentPassword` | `''` | Required for password change |
| `newPassword` | `''` | Required for password change |
| `loading` | `true` | Initial profile fetch |
| `saving` | `false` | Save + password-change in flight |

## Avatar

Photo upload is not yet implemented — clicking the avatar shows
`notifyError('Photo upload is not supported.')`. Initials are computed from the
current `name` value.

## Guards

- Display name cannot be empty (validated client-side with `notifyError`).
- Password change requires both `currentPassword` and `newPassword` to be filled.
- Backend validates password strength; errors surface via `notifyError`.