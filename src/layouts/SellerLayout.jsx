import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SellerSidebar from '@components/seller/SellerSidebar'
import SellerHeader from '@components/seller/SellerHeader'

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
        {/* Sidebar */}
        <SellerSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <SellerHeader onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 overflow-y-auto bg-[#020617] p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    </div>
  )
}

export default SellerLayout
