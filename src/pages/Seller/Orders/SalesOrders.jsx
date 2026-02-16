import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import OrderCard from './components/OrderCard'

const SalesOrders = () => {
  // Mock Data
  const [orders] = useState([
    {
      id: 'OD-10293',
      buyerName: 'Ash Ketchum',
      date: '2023-10-25',
      status: 'Processing',
      total: 180.45,
      items: [
        {
          name: 'Charizard VMAX',
          set: 'Shining Fates',
          quantity: 1,
          image: 'https://images.pokemontcg.io/swsh45/74_hires.png' // Placeholder
        }
      ],
      shippingAddress: {
        street: '123 Pallet Town',
        city: 'Kanto Region',
        zip: '10293'
      }
    },
    {
      id: 'OD-10294',
      buyerName: 'Gary Oak',
      date: '2023-10-24',
      status: 'Shipped',
      total: 450.00,
      items: [
        {
          name: 'Blastoise & Piplup GX',
          set: 'Cosmic Eclipse',
          quantity: 1,
          image: 'https://images.pokemontcg.io/sm12/38_hires.png'
        },
        {
          name: 'Blue-Eyes White Dragon',
          set: 'LOB',
          quantity: 2,
          image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg'
        }
      ],
      shippingAddress: {
        street: '456 Viridian City',
        city: 'Kanto Region',
        zip: '10294'
      }
    },
    {
      id: 'OD-10295',
      buyerName: 'Misty Waterflower',
      date: '2023-10-23',
      status: 'Delivered',
      total: 25.50,
      items: [
        {
          name: 'Starmie V',
          set: 'Astral Radiance',
          quantity: 1,
          image: 'https://images.pokemontcg.io/swsh10/30_hires.png'
        }
      ],
      shippingAddress: {
        street: '789 Cerulean City',
        city: 'Kanto Region',
        zip: '10295'
      }
    }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
       
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default SalesOrders
