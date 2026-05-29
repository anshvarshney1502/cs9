import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import DashboardHeader from './components/Header/DashboardHeader'
import LeftPane from './components/LeftPane/LeftPane'
import Footer from '../../components/Footer/Footer'
import useAuthStore from '../../store/useAuthStore'
import { fetchNotifications, markAllNotifRead, logoutUser } from './service'

function UserLayout() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [isDark, setIsDark]               = useState(false)
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] = useState(false)
  const [currentView, setCurrentView]     = useState('dashboard')
  const [sidebarNav, setSidebarNav]        = useState('Dashboard')
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  useEffect(() => {
    fetchNotifications()
      .then(data => {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount ?? 0)
      })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // Clear locally even if API call fails
    }
    clearUser()
    navigate('/')
  }

  async function handleNotifOpen() {
    if (unreadCount > 0) {
      try {
        await markAllNotifRead()
        setUnreadCount(0)
        setNotifications(ns => ns.map(n => ({ ...n, is_read: true })))
      } catch { /* silent */ }
    }
  }

  return (
    <div
      className={`flex min-h-svh flex-col bg-[#f3f4f6] text-[#191c1d] ${
        isDark ? 'filter-[invert(1)_hue-rotate(180deg)]' : ''
      }`}
    >
      {/* Main row: LeftPane + content */}
      <div className="flex flex-1">
        <LeftPane
          isCollapsed={isLeftPaneCollapsed}
          onToggleCollapse={() => setIsLeftPaneCollapsed(v => !v)}
          sidebarNav={sidebarNav}
          currentView={currentView}
          onNavigate={label => {
            setSidebarNav(label)
            setCurrentView('dashboard')
            navigate('/dashboard')
          }}
        />

        <div className="flex flex-1 flex-col">
          <DashboardHeader
            user={user}
            initials={initials}
            currentView={currentView}
            notifications={notifications}
            unreadCount={unreadCount}
            isDark={isDark}
            onSearchOpen={() => setSearchModalOpen(true)}
            onRaiseQuery={() => navigate('/raise-query')}
            onNotifOpen={handleNotifOpen}
            onDarkToggle={() => setIsDark(v => !v)}
            onProfileSettings={() => navigate('/profile')}
            onLogout={handleLogout}
          />

          <Outlet
            context={{
              user,
              sidebarNav,
              setSidebarNav,
              currentView,
              setCurrentView,
              initials,
              searchModalOpen,
              setSearchModalOpen,
              openSearchModal: () => setSearchModalOpen(true),
            }}
          />
        </div>
      </div>

      {/* Footer — full width, outside content area */}
      <Footer />
    </div>
  )
}

export default UserLayout
