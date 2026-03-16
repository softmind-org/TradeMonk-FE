import { useAuth } from '@/context'
import BuyerProfile from './BuyerProfile'
import SellerProfile from './SellerProfile'

const Profile = () => {
  const { user } = useAuth()

  // Render appropriate profile based on role
  if (user?.role === 'seller') {
    return <SellerProfile />
  }

  // Default to buyer profile
  return <BuyerProfile />
}

export default Profile
