import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import Sidebar from './Sidebar.jsx'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-background text-text-primary">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
