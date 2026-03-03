import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '@components/admin/AdminSidebar'
import AdminHeader from '@components/admin/AdminHeader'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Extract a readable title from the pathname for the header
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop()
    if (!path || path === 'admin') return 'Overview'
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader 
               title={getPageTitle()}
               onMenuClick={() => setSidebarOpen(true)} 
            />
            
            <main className="flex-1 overflow-y-auto bg-[#020617] p-6 md:p-8">
                <div className="max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout
