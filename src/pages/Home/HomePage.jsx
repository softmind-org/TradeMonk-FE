/**
 * Home Page Component
 */
import { useNavigate } from 'react-router-dom'
import { Header, Footer } from '@components/common'
import HeroSection from './components/HeroSection'
import WelcomeSection from './components/WelcomeSection'
import GradingSection from './components/GradingSection'
import LatestArrivals from './components/LatestArrivals'
import { useAuth } from '@context'

const HomePage = () => {
  const navigate = useNavigate()
  
  // Dynamic data - will be fetched from API
  const heroStats = {
    listings: '50k+',
    sellers: '12k+',
    volume: '$4.2M'
  }

  const { isAuthenticated, user } = useAuth()
  
  // Cart count - will come from cart state/context
  const cartCount = 0

  // Handle card click - navigate to card detail
  const handleCardClick = (cardId) => {
    navigate(`/product/${cardId}`)
  }

  return (
    <div className="bg-background">
      <Header cartCount={cartCount} />
      
      <main>
        {isAuthenticated ? (
          <WelcomeSection user={user} />
        ) : (
          <HeroSection stats={heroStats} />
        )}
        
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
