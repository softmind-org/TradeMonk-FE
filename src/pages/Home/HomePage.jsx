/**
 * Home Page Component
 */
import { useNavigate } from 'react-router-dom'
import HeroSection from './components/HeroSection'
import WelcomeSection from './components/WelcomeSection'
import GradingSection from './components/GradingSection'
import LatestArrivals from './components/LatestArrivals'
import { useAuth } from '@context'

const HomePage = () => {
  const navigate = useNavigate()
  
  const heroStats = {
    listings: '50k+',
    sellers: '12k+',
    volume: '$4.2M'
  }

  const { isAuthenticated, user } = useAuth()

  const handleCardClick = (cardId) => {
    navigate(`/product/${cardId}`)
  }

  return (
    <div className="bg-background">
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
    </div>
  )
}

export default HomePage

