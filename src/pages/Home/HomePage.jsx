/**
 * Home Page Component
 */
import { useNavigate } from 'react-router-dom'
import { Header, Footer } from '@components/common'
import HeroSection from './components/HeroSection'
import GradingSection from './components/GradingSection'
import LatestArrivals from './components/LatestArrivals'
import { useAuth } from '@context' // Import auth to simulate login

const HomePage = () => {
  const navigate = useNavigate()
  
  // Dynamic data - will be fetched from API
  const heroStats = {
    listings: '50k+',
    sellers: '12k+',
    volume: '$4.2M'
  }

  const { isAuthenticated, login, logout } = useAuth()
  
  // Cart count - will come from cart state/context
  const cartCount = 0

  // Quick dev helper to toggle login status for testing
  const toggleAuth = () => {
    if (isAuthenticated) {
      logout()
    } else {
      login({ name: 'User' }, 'dummy-token')
    }
  }

  // Handle card click - navigate to card detail
  const handleCardClick = (cardId) => {
    navigate(`/product/${cardId}`)
  }

  return (
    <div className="bg-background">
      <Header cartCount={cartCount} />
      
      {/* Dev helper to test "Login" view */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleAuth}
          className="bg-primary text-background px-4 py-2 rounded shadow-lg text-xs font-bold"
        >
          {isAuthenticated ? 'Test: Logout' : 'Test: Login'}
        </button>
      </div>
      
      <main>
        <HeroSection stats={heroStats} />
        
        <LatestArrivals 
          onCardClick={handleCardClick}
        />
        
        <GradingSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage
