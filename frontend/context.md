# Frontend Conventions

## Component Pattern

Reusable components live in `src/components/` with a folder per component:

```
src/components/Button/
├── Button.tsx          # Implementation
└── README.md           # Usage notes (for complex/shared components)
```

Use direct file imports. **Do NOT** use `index.tsx` barrel exports for single-component folders — they add indirection with no benefit.

## Feature/Page Pattern

Feature pages live in `src/pages/<section>/pages/<PageName>/index.jsx`. Keep co-located logic inside the feature folder; promote to shared `components/`, `service.js`, or `constants.js` only when genuinely reused.

## State Ownership

| State type | Where |
|------------|-------|
| Auth (user, token) | `useAuthStore` (Zustand, persisted) |
| UI (modals, active tab, selected item) | Component `useState` |
| Server data (questions, notifications) | `useState` + service calls in `useEffect` |

## Service Layer

- **Shared services** — `pages/user/service.js` (fetchQuestions, voteQuestion, fetchNotifications, etc.)
- **Page-specific services** — co-located with the page (e.g. `pages/landing/service.jsx`)
- Keep network calls out of components; place them in service files.

## Routing

Routes defined in `routes/index.jsx`. Use `ProtectedRoute` for auth-gated pages. SPA navigation within the user section — **no URL changes** when switching tabs or viewing question details inline.

## Styling

- **Tailwind CSS v4** — utility-first, no UI kit
- **Brand color** — `#8c6a40` (brown); use throughout for accents, active states, buttons
- **Fonts** — `font-display` for headings, standard sans for body
- **Text sizes** — match landing page convention: `text-[13px]` body, `text-[15px]` headings, `text-[11px]` labels/caps
- **No raw HTML** — use `dangerouslySetInnerHTML` only for trusted content (FAQ answers from DB)

## Imports — Path Depth

Files in `pages/user/pages/<PageName>/` need **4 levels up** to reach `src/`:
```
pages/user/pages/Dashboard/index.jsx
→ ../../../../components/   ✓
```

Files in `pages/user/components/<ComponentName>/` also need **4 levels up**:
```
pages/user/components/QuestionCard/QuestionCard.jsx
→ ../../../../components/   ✓
```

Files in `pages/user/layout.jsx` need **3 levels up**:
```
pages/user/layout.jsx
→ ../../../components/       ✓
```

## Component Communication

- **Props** — parent → child data flow
- **Context (Outlet context)** — layout → nested pages via React Router's `useOutletContext`
- **Callbacks** — child → parent events via prop functions

## Global Components (src/components/)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Button` | All buttons | `variant` (`primary`\|`secondary`\|`ghost`), `onClick`, `className` |
| `Input` | Text inputs | `type`, `value`, `onChange`, `placeholder`, `className` |
| `Modal` | Dialog overlay | `isOpen`, `onClose`, `position` (`center`\|`top-right`), `title` |
| `Select` | Dropdown select | `options`, `value`, `onChange`, `placeholder` |
| `Footer` | Site-wide footer | — |

## Notifications / Toasts

Use `notifyError()` / `notifySuccess()` from `lib/notify.js` for inline feedback. Avoid `window.alert`.

## Icons

From **lucide-react**. Keep `strokeWidth={1.8}` for consistent weight. Common icons used:

| Icon | Usage |
|------|-------|
| `ChevronUp` | Upvote |
| `MessageCircle` | Comment count |
| `Reply` | Reply / View action |
| `Flag` | Report |
| `Search` | Search modal |
| `Bell` / `BellRing` | Notifications |
| `Sun` / `Moon` | Dark mode toggle |
| `PanelLeft` / `PanelLeftClose` | Sidebar collapse |
| `TrendingUp` | FAQ categories |
| `LinkIcon` | Contributions |
| `CheckCircle` / `Clock` | Status indicators |
| `LogOut` / `Settings` | User menu |
