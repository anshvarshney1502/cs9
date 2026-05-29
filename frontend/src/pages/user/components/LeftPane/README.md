# LeftPane

Sidebar navigation panel for the student dashboard. Collapsible — when expanded `w-56`, when collapsed `w-16` showing only icons.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isCollapsed` | `boolean` | ✅ | Whether the sidebar is in collapsed mode |
| `onToggleCollapse` | `function` | ✅ | Toggles `isCollapsed` state |
| `sidebarNav` | `string` | ✅ | Current sidebar nav label (matches `NAV_ITEMS` keys) |
| `currentView` | `string` | ✅ | Active view name — `'dashboard'` activates nav |
| `onNavigate` | `function` | ✅ | Callback with nav label to switch views |

## States

| State | Width | Visible |
|-------|-------|---------|
| Expanded | `w-56` (224px) | Brand + "Internship Hub" subtitle + "Student portal" label + nav labels |
| Collapsed | `w-16` (64px) | Brand text only + nav icons only |

## Nav Items

| Label | Icon | Behaviour |
|-------|------|-----------|
| `Dashboard` | `LayoutGrid` | Sets sidebar nav + switches to dashboard |
| `My Queries` | `MessageSquare` | Sets sidebar nav (view switch handled by parent) |

## Active State Styling

Active nav item (both `sidebarNav` matches AND `currentView === 'dashboard'`):
- `border-r-2 border-[#8c6a40]`
- `bg-[#8c6a40]/10`
- `font-semibold text-[#8c6a40]`

Hover state (inactive):
- `hover:bg-[#8c6a40]/10 hover:text-[#8c6a40]`

Inactive default: `text-[#444748]`

## Visual Elements

- Vertical connector line between nav items (dotted `bg-[#d9dadb]`)
- Brand section at top: "Rogāre" in `#8c6a40` + "Internship Hub" subtitle (hidden when collapsed)
- Section label: "Student portal" (hidden when collapsed)
- Toggle button at bottom: `PanelLeftClose` when expanded, `PanelLeft` when collapsed
- Background: `#f8f9fa` (light gray, distinct from content area)

## Notes

- Clicking the brand logo navigates to `'Dashboard'`
- Width transitions with `transition-all duration-300`
- Collapse state is owned by `UserLayout`, not `LeftPane`
- The vertical connector line uses `absolute` positioning from the nav container
