/**
 * Footer Component
 * Main footer with links and newsletter signup
 */
import { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Will be connected to newsletter API
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  const currentYear = new Date().getFullYear()

  const marketplaceLinks = [
    { label: 'Pokémon', href: '/pokemon' },
    { label: 'Yu-Gi-Oh', href: '/yugioh' },
    { label: 'Magic: The Gathering', href: '/magic' },
    { label: 'Latest Arrivals', href: '/latest' },
  ]

  const resourceLinks = [
    { label: 'Price Guide', href: '/price-guide' },
    { label: 'Authentication', href: '/authentication' },
    { label: 'Seller Tools', href: '/seller-tools' },
    { label: 'Help Center', href: '/help' },
  ]

  return (
    <footer className="bg-card">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-4">Trademonk</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premier destination for serious TCG collectors. Buy, sell, and track the value of your rarest cards with confidence.
            </p>
          </div>

          {/* Marketplace Column */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Marketplace</h4>
            <ul className="space-y-3">
              {marketplaceLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-foreground font-medium mb-4">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest rare drops directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
              />
              <button
                type="submit"
                className="bg-secondary text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Trademonk Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-muted-foreground text-sm hover:text-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground text-sm hover:text-secondary transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-muted-foreground text-sm hover:text-secondary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
