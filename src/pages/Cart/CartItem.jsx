/**
 * Cart Item Component
 * Displays a single cart item with quantity controls
 */
import { Trash2, Minus, Plus } from 'lucide-react'
import { pokemonLogo } from '@assets'

const CartItem = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove,
  formatImageUrl 
}) => {
  const { id, title, collectionName, price, quantity, image } = item

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-28 md:w-24 md:h-32 bg-[#0B1220] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img 
            src={formatImageUrl ? formatImageUrl(image) : (image || pokemonLogo)} 
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-white font-bold text-base md:text-lg truncate">
                {title}
              </h3>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
                {collectionName}
              </p>
            </div>
            
            {/* Delete Button */}
            <button 
              onClick={() => onRemove(id)}
              className="text-red-400/60 hover:text-red-400 transition-colors p-1 flex-shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Quantity & Price Row */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-1 bg-background rounded-lg border border-border">
              <button 
                onClick={() => onDecrement(id)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-white font-medium text-sm">
                {quantity}
              </span>
              <button 
                onClick={() => onIncrement(id)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Price */}
            <p className="text-white font-bold text-lg md:text-xl">
              ${(price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
