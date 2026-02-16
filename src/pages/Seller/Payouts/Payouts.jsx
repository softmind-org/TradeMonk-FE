import { useState } from 'react'
import { ShieldCheck, ArrowRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui'

const Payouts = () => {
  // Mock Data
  const [payouts] = useState([
    {
      id: 'PY-992',
      date: '2024-03-10',
      amount: 450.00,
      status: 'SUCCESSFUL'
    },
    {
      id: 'PY-991',
      date: '2024-03-01',
      amount: 1200.00,
      status: 'SUCCESSFUL'
    },
    {
      id: 'PY-990',
      date: '2024-02-15',
      amount: 310.20,
      status: 'SUCCESSFUL'
    }
  ])

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white">Earnings</h1>

      {/* Available Balance Card */}
      <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A34A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
              Available for Payout
            </span>
            <div className="text-5xl md:text-6xl font-black text-white mb-3">
              €2,140.50
            </div>
            <div className="flex items-center gap-2 text-[#16A34A]">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Secure Payouts via Stripe Connect</span>
            </div>
          </div>
          
          <Button 
            className=" !bg-[#16A34A] text-white font-bold px-8 py-4 h-auto text-sm uppercase tracking-wide "
          >
            Request Payout Now
          </Button>
        </div>
      </div>

      {/* Payout History Section */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">
          Payout History
        </h2>
        
        <div className="bg-[#111C2E] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          {payouts.map((payout) => (
            <div 
              key={payout.id} 
              className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                  <DollarSign size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">#{payout.id}</span>
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">{payout.date}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-bold text-lg mb-1">
                  €{payout.amount.toFixed(2)}
                </div>
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider bg-[#16A34A]/10 px-2 py-0.5 rounded">
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Policy Footer */}
      <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm mb-1">Commission Policy</h3>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl">
            Trademonk deducts a flat 10% platform fee from every sale to cover authentication, payment processing, and secure shipping insurance. Payouts are processed within 24-48 hours of item delivery.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payouts
