/**
 * MainLayout Component
 * The default layout wrapper for pages
 */
import { Header, Footer } from '@components/common'

const MainLayout = ({ children }) => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header navItems={navItems} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
