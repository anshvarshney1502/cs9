# DashboardHeader

Top navigation bar for the student dashboard. Contains: search trigger, "Raise New Query" button, notification bell, dark mode toggle, and user avatar + dropdown menu.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | `object \| null` | Current user object from `useAuthStore` |
| `initials` | `string` | Avatar initials, e.g. `"AB"` |
| `currentView` | `string` | Controls visibility of the "Raise New Query" button (`'dashboard'` shows it) |
| `notifications` | `array` | Array of notification objects to display in the dropdown |
| `unreadCount` | `number` | Count of unread notifications — shows a red dot on the bell icon |
| `isDark` | `boolean` | Current dark mode state — determines Sun/Moon icon |
| `onSearchOpen` | `function` | Opens the search modal in DashboardPage |
| `onRaiseQuery` | `function` | Navigates to `/raise-query` |
| `onNotifOpen` | `function` | Called when bell is clicked to open notifications (marks them as read) |
| `onDarkToggle` | `function` | Toggles dark mode state |
| `onProfileSettings` | `function` | Navigates to `/profile` |
| `onLogout` | `function` | Logs the user out (calls API + clears Zustand + redirects) |

## Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Search bar placeholder]     [Raise New Query]  [🔔] [🌙/☀️]  [👤]  │
└─────────────────────────────────────────────────────────────────────┘
```

## Features

### Search Bar
- Fixed `w-[420px]` input-style button in the header
- Clicking triggers `onSearchOpen()` → opens the search modal in `DashboardPage`
- Placeholder: `"Search FAQs, categories, or status…"`

### Raise New Query Button
- Only visible when `currentView === 'dashboard'`
- Navigates via `onRaiseQuery()` → `/raise-query`

### Notification Bell
- Red dot indicator when `unreadCount > 0`
- Click calls `onNotifOpen()` (marks all as read) and opens the dropdown
- Dropdown shows notification list, unread items highlighted in `#f0f9ff`
- `View All` footer link (no-op / placeholder)

### Dark Mode Toggle
- Sun icon when dark mode on, Moon icon when off
- Calls `onDarkToggle()` on click

### User Menu Dropdown
- Avatar circle with initials + user name (capitalized) + role chip
- **Profile Settings** — calls `onProfileSettings()` → `/profile`
- **Logout** — calls `onLogout()` → `POST /api/auth/logout` + clear store + redirect to `/`

### Interaction Notes
- Clicking anywhere on the header (outside dropdowns) calls `closeAll()` → closes both notification and user menus
- Dropdown menus stop propagation — clicking inside them does NOT close the other dropdown
- `showNotif` and `showUserMenu` are independent; opening one closes the other

## State

All UI state (`showNotif`, `showUserMenu`) is **local** to this component — no props needed for open/close.

## Typography

| Element | Style |
|---------|-------|
| Username | `text-[13px] font-medium capitalize` |
| Role chip | `text-[10px] font-semibold uppercase tracking-wide text-[#747878]` |
| Nav items in dropdown | `text-[13px] font-medium` |
| Dropdown section header | `text-[13px] font-semibold` |
