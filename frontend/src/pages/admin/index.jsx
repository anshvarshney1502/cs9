import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import AdminHeader from './components/Header/AdminHeader'
import AdminLeftPane from './components/LeftPane/AdminLeftPane'
import DashboardView from './pages/Dashboard'
import FAQManagementView from './pages/FAQManagement'
import QueriesManagementView from './pages/QueriesManagement'
import SparkLeaderboardView from './pages/SparkLeaderboard'
import AdminProfileView from './pages/AdminProfile'
import {
  fetchAdminDashboard,
  fetchAdminNotifications,
  logoutAdmin,
  markAllAdminNotificationsRead,
} from './service'

function AdminHome() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()
  const [currentAdminView, setCurrentAdminView] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const initials = user?.name
    ? user.name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'A'

  const loadDashboard = useCallback(async () => {
    setIsDashboardLoading(true)
    try {
      const data = await fetchAdminDashboard()
      setDashboardData(data)
    } catch {
      setDashboardData(null)
    } finally {
      setIsDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadInitialDashboard() {
      try {
        const data = await fetchAdminDashboard()
        if (isActive) setDashboardData(data)
      } catch {
        if (isActive) setDashboardData(null)
      } finally {
        if (isActive) setIsDashboardLoading(false)
      }
    }

    loadInitialDashboard()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadNotifications() {
      try {
        const data = await fetchAdminNotifications()
        if (!isActive) return
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount ?? 0)
      } catch {
        if (!isActive) return
        setNotifications([])
        setUnreadCount(0)
      }
    }

    loadNotifications()

    return () => {
      isActive = false
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutAdmin()
    } catch {
      // Local logout still wins if the network request fails.
    }
    clearUser()
    navigate('/')
  }

  async function handleNotificationsOpen() {
    if (unreadCount === 0) return

    try {
      await markAllAdminNotificationsRead()
      setUnreadCount(0)
      setNotifications((items) => items.map((item) => ({ ...item, is_read: true })))
    } catch {
      // Keep the current unread state if the request fails.
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    if (searchQuery.trim()) {
      setCurrentAdminView('queriesManagement')
    }
  }

  const viewProps = {
    dashboardData,
    isLoading: isDashboardLoading,
    searchQuery,
    onRefresh: loadDashboard,
  }

  return (
    <div className="flex min-h-svh bg-[#f3f4f6] text-[#111827]">
      <AdminLeftPane currentView={currentAdminView} onNavigate={setCurrentAdminView} />

      <main className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          user={user}
          initials={initials}
          searchQuery={searchQuery}
          notifications={notifications}
          unreadCount={unreadCount}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onNotificationsOpen={handleNotificationsOpen}
          onLanding={() => navigate('/')}
          onLogout={handleLogout}
        />

        {currentAdminView === 'dashboard' && <DashboardView {...viewProps} />}
        {currentAdminView === 'queriesManagement' && <QueriesManagementView {...viewProps} />}
        {currentAdminView === 'sparkLeaderboard' && <SparkLeaderboardView {...viewProps} />}
        {currentAdminView === 'faqManagement' && <FAQManagementView {...viewProps} />}
        {currentAdminView === 'adminProfile' && <AdminProfileView user={user} />}
      </main>
    </div>
  )
}

export default AdminHome
