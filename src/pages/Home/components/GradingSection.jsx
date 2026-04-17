import { ShieldCheck, Lock, Globe, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Professional Grading & Trust Section Component
 * Displays platform security features and grading partners
 */

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Identity Escrow',
    description: "Every merchant undergoes institutional-grade identity verification. We ensure you're dealing with real, reputable collectors.",
    iconColor: '#D4A017', // Gold/Yellow
    bgColor: 'rgba(212, 160, 23, 0.1)'
  },
  {
    icon: Lock,
    title: 'Funds Protection',
    description: 'Payouts are held in secure escrow until the buyer confirms the collectible matches the described condition.',
    iconColor: '#3B82F6', // Blue
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  {
    icon: Globe,
    title: 'Global Logistics',
    description: 'Fully insured, tracked, and professionally packaged. We manage the risk of high-value transit so you don\'t have to.',
    iconColor: '#10B981', // Green
    bgColor: 'rgba(16, 185, 129, 0.1)'
  }
]

const GRADING_PARTNERS = ['PSA', 'BECKETT', 'CGC', 'SGC']

const GradingSection = () => {
  return (
    <section className="py-12 ">
      <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[32px] p-8 md:p-16 lg:p-20 border border-white/5 shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-6 tracking-tight">
            Securing the Future of TCG
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            We've built the most rigorous trust ecosystem in the industry. Every
            transaction is backed by our multi-layered protection protocol.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:mb-28">
          {TRUST_FEATURES.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 group"
            >
              {/* Icon Container */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: feature.bgColor }}
              >
                <feature.icon size={22} style={{ color: feature.iconColor }} />
              </div>

              {/* Text Content */}
              <h3 className="text-white text-lg font-bold mb-4 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer: Partners & CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-white/5">
          {/* Partners Logos (Moted placeholder) */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
            {GRADING_PARTNERS.map((partner) => (
              <span 
                key={partner}
                className="text-muted-foreground/40 text-lg md:text-xl font-black tracking-widest hover:text-muted-foreground/70 transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <Link to="/register?role=seller">
            <button className="flex items-center gap-3 bg-[#0F172A] border border-white/10 hover:border-white/20 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl group transition-all">
              Start Selling
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GradingSection
