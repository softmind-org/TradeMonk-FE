/**
 * Product Detail Page
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MainLayout } from '@layouts' // Assuming MainLayout wraps Header/Footer
import { pokemonLogo, charizard, blueEyes, blackLotus, gengar, umbreon, exodia, darkMagicianGirl } from '@assets' 
import { Button } from '@components/ui'

const ProductDetail = () => {
  const { id } = useParams()
  
  // Mock Data matching the screenshot exactly
  const product = {
    id: id,
    title: 'Charizard VMAX',
    collection: 'SHINING FATES',
    price: 185.50,
    images: [charizard], // using imported asset
    badges: ['MINT', 'ENGLISH', 'FREE SHIPPING'],
    rarity: 'SECRET RARE',
    authentication: 'VERIFIED',
    description: 'Freshly pulled and immediately sleeved. Centering is perfect.',
    seller: {
      name: 'MasterCollector99',
      reputation: 'MASTER SELLER',
      positiveFeedback: '99.8% POSITIVE'
    }
  }

  // If ID dictates other cards, we could switch data here, but defaulting to Charizard for design match
  
  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-20 pt-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            RETURN TO GALLERY
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-5">
              <div className="bg-[#0B1220] rounded-3xl p-8 border border-white/5 relative aspect-[3/4] flex items-center justify-center">
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                
                {/* Image Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-6 h-1.5 bg-[#D4A017] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header */}
              <div>
                <div className="flex gap-3 mb-4">
                  <span className="bg-[#D4A017]/10 text-[#D4A017] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#D4A017]/20 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     {product.badges[0]}
                  </span>
                   <span className="bg-[#1E3A8A]/20 text-[#60A5FA] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#1E3A8A]/30 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                     </svg>
                     {product.badges[1]}
                  </span>
                   <span className="bg-[#059669]/10 text-[#34D399] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#059669]/20 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                     </svg>
                     {product.badges[2]}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{product.title}</h1>
                <p className="text-muted-foreground text-lg uppercase tracking-wide font-medium">{product.collection}</p>
              </div>

              {/* Price Box */}
              <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Price</div>
                    <div className="text-5xl md:text-6xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                    <Button 
                       className="w-full bg-[#D4A017] hover:bg-[#B38612] text-black font-bold py-4 text-sm uppercase tracking-wider"
                    >
                      Add to Cart
                    </Button>
                    <Button 
                       className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 text-sm uppercase tracking-wider border border-white/10"
                    >
                      Submit an Offer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Item Description</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Info Grid (Chart & Authentication) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Historical Market Chart Placeholder */}
                <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 h-40 relative overflow-hidden flex flex-col justify-end">
                  <div className="absolute top-6 left-6 flex justify-between w-[calc(100%-48px)]">
                      <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Historical Market Value</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#34D399] uppercase tracking-widest">+12.4% (90D)</span>
                  </div>
                  
                  {/* Fake Line Chart */}
                  <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none">
                     <path 
                      d="M0,48 Q40,48 80,40 T160,30 T240,15 T320,5" 
                      fill="none" 
                      stroke="#D4A017" 
                      strokeWidth="3"
                     />
                     <path 
                      d="M0,48 Q40,48 80,40 T160,30 T240,15 T320,5 L320,60 L0,60 Z" 
                      fill="url(#gradient)" 
                      opacity="0.2"
                     />
                     <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D4A017" />
                          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                  </svg>
                </div>
                
                 {/* Detail Badges Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rarity</span>
                       <span className="text-white font-bold text-lg">{product.rarity}</span>
                    </div>
                     <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Authentication</span>
                       <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[#34D399] font-bold text-lg">{product.authentication}</span>
                       </div>
                    </div>
                 </div>
               </div>

              {/* Seller Card */}
              <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      M
                   </div>
                   <div>
                      <div className="text-white font-bold text-lg">{product.seller.name}</div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-muted-foreground">{product.seller.reputation}</span>
                         <span className="text-[#D4A017]">• {product.seller.positiveFeedback}</span>
                      </div>
                   </div>
                </div>
                <button className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                   </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProductDetail
