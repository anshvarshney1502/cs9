import { useState } from 'react'
import {
  Popover, PopoverButton, PopoverPanel,
  Menu, MenuButton, MenuItems, MenuItem,
} from '@headlessui/react'
import { Settings, Search, SlidersHorizontal, PlusCircle, Bell, LogOut, Moon, Sun } from 'lucide-react'
import { timeAgo } from '../../service'
import Button from '../../../../components/Button/Button'

const ALL_TAGS = ['DSA', 'Web Dev', 'CP', 'AI/ML', 'Systems', 'OS', 'DBMS', 'OOP', 'Aptitude', 'Interview Exp']

function DashboardHeader({
  user,
  initials,
  currentView,
  showRaiseQuery = true,
  notifications,
  unreadCount,
  isDark,
  onSearchOpen,         // fn(value: string) — called on search input change
  onRaiseQuery,
  onNotifOpen,
  onNotifViewAll,
  onDarkToggle,
  onProfileSettings,
  onLogout,
  selectedTags = [],    // string[], from layout state
  onTagsChange,         // fn(tags: string[]), called when tag toggled in popover
}) {
  const [localTags, setLocalTags] = useState(selectedTags)

  function handleTagToggle(tag) {
    const next = localTags.includes(tag)
      ? localTags.filter(t => t !== tag)
      : [...localTags, tag]
    setLocalTags(next)
    onTagsChange?.(next)
  }

  const activeTagCount = localTags.length

  return (
    <header className="relative flex items-center justify-between border-b border-[#c4c7c7] bg-white px-8 py-4">

      {/* Search bar — inline with tag filter button */}
      <div className="relative flex w-[420px] items-center gap-2 rounded-lg bg-[#edeeef] px-3 py-2 transition hover:bg-[#e5e6e7]">
        <Search className="h-4 w-4 shrink-0 text-[#747878]" strokeWidth={1.8} />

        <input
          type="text"
          placeholder="Search FAQs, categories, or status…"
          className="flex-1 bg-transparent text-[12px] text-[#191c1d] placeholder-[#747878] outline-none"
          onChange={e => onSearchOpen?.(e.target.value)}
          onFocus={() => onSearchOpen?.('')}
        />

        <span className="h-4 w-px bg-[#c4c7c7]" />

        {/* Filter — tag popover */}
        <Popover>
          <PopoverButton className="relative flex shrink-0 items-center gap-1 text-[#9ca3af] transition hover:text-[#191c1d]">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
            {activeTagCount > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8c6a40] text-[9px] font-bold text-white">
                {activeTagCount}
              </span>
            )}
          </PopoverButton>

          <PopoverPanel className="absolute left-0 top-10 z-50 w-64 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl focus:outline-none">
            <p className="border-b border-[#f3f4f6] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              Filter by tag
            </p>
            <div className="flex flex-wrap gap-1.5 p-3">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition ${
                    localTags.includes(tag)
                      ? 'border-[#8c6a40] bg-[#8c6a40] text-white'
                      : 'border-[#dde1e3] text-[#444748] hover:border-[#8c6a40] hover:text-[#8c6a40]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {activeTagCount > 0 && (
              <div className="border-t border-[#f3f4f6] px-3 py-2">
                <button
                  type="button"
                  onClick={() => { setLocalTags([]); onTagsChange?.([]) }}
                  className="text-[11px] font-semibold text-[#8c6a40] hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </PopoverPanel>
        </Popover>
      </div>

      {/* Right-side action group */}
      <div className="flex items-center gap-6">
        {showRaiseQuery && (
          <Button
            variant="secondary"
            className="gap-2 rounded-lg border-transparent bg-[#8c6a40]/80 px-4 text-[11px] font-bold uppercase tracking-wide text-white hover:border-transparent hover:bg-[#7a5c35]"
            onClick={onRaiseQuery}
          >
            <PlusCircle className="h-4 w-4" strokeWidth={1.8} /> Raise New Query
          </Button>
        )}

        {/* Bell */}
        <Popover className="relative">
          <PopoverButton
            onClick={() => onNotifOpen?.()}
            className="relative p-1 text-[#444748] transition hover:text-black focus:outline-none"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </PopoverButton>

          <PopoverPanel className="absolute right-0 top-9 z-50 w-80 overflow-hidden rounded-lg border border-[#c4c7c7] bg-white shadow-lg focus:outline-none">
            <p className="border-b border-[#c4c7c7] px-4 py-3 text-[13px] font-semibold text-[#191c1d]">
              Notifications
            </p>
            {notifications.length === 0 ? (
              <p className="px-4 py-5 text-center text-[12px] text-[#747878]">No notifications yet</p>
            ) : (
              notifications.slice(0, 3).map(n => (
                <div
                  key={n.notification_id || n.id}
                  className={`border-b border-[#f3f4f6] px-4 py-3 ${n.is_read ? 'bg-white' : 'bg-[#f0f9ff]'}`}
                >
                  <p className="mb-1 text-[12px] leading-snug text-[#444748]">{n.body || n.title}</p>
                  <span className="text-[10px] font-medium text-[#9ca3af]">
                    {n.created_at ? timeAgo(n.created_at) : ''}
                  </span>
                </div>
              ))
            )}
            <button
              type="button"
              onClick={onNotifViewAll}
              className="w-full cursor-pointer bg-[#f8f9fa] py-2.5 text-center text-[11px] font-semibold text-[#8c6a40] transition hover:bg-[#edeeef]"
            >
              View All
            </button>
          </PopoverPanel>
        </Popover>

        {/* Dark mode */}
        <button
          type="button"
          className="p-1 text-[#444748] transition hover:text-black"
          onClick={() => onDarkToggle()}
        >
          {isDark
            ? <Sun  className="h-[18px] w-[18px]" strokeWidth={1.8} />
            : <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />}
        </button>

        {/* Divider */}
        <span className="h-8 w-px bg-[#c4c7c7]" />

        {/* User menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-3 focus:outline-none">
            <div className="text-right leading-tight">
              <p className="text-[13px] font-medium capitalize text-[#191c1d]">{user?.name || 'Student'}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#747878]">{user?.role || 'USER'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8c6a40] text-[12px] font-bold text-white">
              {initials}
            </div>
          </MenuButton>

          <MenuItems className="absolute right-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-lg border border-[#c4c7c7] bg-white shadow-lg focus:outline-none">
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-medium text-[#444748] transition data-focus:bg-[#f8f9fa]"
                onClick={onProfileSettings}
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={1.8} /> <span className="text-[13px] font-medium capitalize">Profile Settings</span>
              </button>
            </MenuItem>
            <div className="h-px bg-[#c4c7c7]" />
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-medium text-red-600 transition data-focus:bg-[#f8f9fa]"
                onClick={onLogout}
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} /> <span className="text-[13px] font-medium">Logout</span>
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  )
}

export default DashboardHeader