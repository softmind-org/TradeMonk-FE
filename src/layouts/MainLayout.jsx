/**
 * MainLayout Component
 * The default layout wrapper for pages
 */
import { Outlet } from 'react-router-dom'
import { Header, Footer } from '@components/common'

const MainLayout = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace', href: '/marketplace' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header navItems={navItems} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

