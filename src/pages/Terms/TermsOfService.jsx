const TOS_ARTICLES = [
  {
    id: 1,
    title: 'Article 1 – Definitions',
    content: [
      '1.1 In these Terms and Conditions, the following capitalized terms shall have the following meanings:',
      'Account: the account of the User on the Platform;',
      'Advertisement: the advertisement on the Platform containing information about the Item;',
      'Service: the online intermediary service made available by TradeMonk to the User via the Platform;',
      'User: the individual or company using or wishing to use the Service;',
      'High-Value Item: any Item with a Price of €150 or more;',
      'Item: the trading card, sealed product, graded card, or related collectible;',
      'Purchase Agreement: the purchase agreement between the Buyer and the Seller;',
      'Buyer: the User who has created an Account as a buyer on the Platform;',
      'TradeMonk: TradeMonk, located at Keenkestraat 13, Gronsveld, the Netherlands, KvK 99938561.',
      'Seller: the User who has created an Account as a seller.'
    ]
  },
  {
    id: 2,
    title: 'Article 2 – General',
    content: [
      '2.1 These Terms and Conditions apply to the Agreement and to the use of the Service.',
      '2.2 These Terms and Conditions are published on the Platform.',
      '2.3 Any deviations shall only be valid if expressly agreed in Writing.',
      '2.4 If any provision is null and void, the remaining provisions remain fully applicable.',
      '2.5 Lack of strict enforcement does not waive TradeMonk\'s rights.'
    ]
  },
  {
    id: 3,
    title: 'Article 3 – Amendments to the Terms and Conditions',
    content: [
      '3.1 TradeMonk has the right to amend these Terms and Conditions.',
      '3.2 Users will be notified In Writing at least 1 month before new terms enter into force.',
      '3.4 Continued use after the effective date constitutes acceptance of the new version.'
    ]
  },
  {
    id: 4,
    title: 'Article 4 – Nature of the Platform',
    content: [
      'The purpose of the Platform is to provide an intermediary service. TradeMonk is not the seller of the Items and is not a party to the transaction concluded between the Buyer and the Seller. TradeMonk acts solely as an intermediary.'
    ]
  },
  {
    id: 5,
    title: 'Article 5 – Account and Eligibility Requirements',
    content: [
      '5.1 Users must create an Account to use the Platform.',
      '5.5 Users must be at least 18 years old and provide accurate information.',
      '5.7 Sellers must not have criminal convictions involving fraud risk.',
      '5.11 Users are responsible for maintaining confidentiality of their login credentials.',
      '5.14 TradeMonk may block or close accounts for violations or fraud.'
    ]
  },
  {
    id: 6,
    title: 'Article 6 – Offer',
    content: [
      '6.1 Items are offered by Sellers, not TradeMonk. TradeMonk does not guarantee the quality of delivered Items.',
      '6.2 TradeMonk is not responsible for texts or photos in Advertisements.',
      '6.3 Price is determined by the Seller.'
    ]
  },
  {
    id: 7,
    title: 'Article 7 – The Service',
    content: [
      '7.1 TradeMonk provides the Service as a reasonably prudent professional provider.',
      '7.2 The Platform may be taken out of service for maintenance.',
      '7.4 TradeMonk may decide to discontinue the Platform with 1 month notice.'
    ]
  },
  {
    id: 8,
    title: 'Article 8 – Offering the Item and Advertisement',
    content: [
      '8.1 Sellers must create a Stripe account.',
      '8.2 Sellers must provide accurate descriptions and clear photos.',
      '8.3 Counterfeit, falsely graded, or illegal products are prohibited.',
      '8.6 TradeMonk may remove Advertisements for violations.'
    ]
  },
  {
    id: 9,
    title: 'Article 9 – Displaying Advertisements and Ranking',
    content: [
      '9.1 Advertisements are displayed by category and search relevancy.',
      '9.3 Default sorting is by date (most recent first). Sellers cannot pay to influence ranking.'
    ]
  },
  {
    id: 10,
    title: 'Article 10 – Purchase Agreement',
    content: [
      '10.1 Buyers enter into Purchase Agreements directly with Sellers.',
      '10.2 TradeMonk is not a party to the Purchase Agreement.',
      '10.3 Sellers are obliged to deliver Items once an agreement is concluded.'
    ]
  },
  {
    id: 11,
    title: 'Article 11 – Delivery',
    content: [
      '11.1 Sellers are responsible for proper packaging and timely dispatch.',
      '11.2 High-Value Items may require tracking, insurance, and signature.'
    ]
  },
  {
    id: 12,
    title: 'Article 12 – Right of Withdrawal',
    content: [
      '12.1 Professional Sellers must comply with statutory right of withdrawal laws.',
      '12.3 If a Seller has already been paid, they must refund the Buyer if withdrawal is exercised.'
    ]
  },
  {
    id: 13,
    title: 'Article 13 – High-Value Item Policy',
    content: [
      '13.1 TradeMonk may impose additional requirements for High-Value Items (tracking, extended payout, etc.).'
    ]
  },
  {
    id: 14,
    title: 'Article 14 – Fraud Prevention',
    content: [
      '14.1 Accounts may be suspended or payouts delayed in connection with fraud prevention.'
    ]
  },
  {
    id: 15,
    title: 'Article 15 – Platform Fees',
    content: [
      '15.1 Sellers owe a 3.5% commission on the Price (excluding shipping).',
      '15.3 Stripe processing costs are borne by the Seller.',
      '15.6 All payments are processed through Stripe.'
    ]
  },
  {
    id: 16,
    title: 'Article 16 – Payout Policy',
    content: [
      '16.1 Payout occurs after shipping, a minimum 7-day period, and delivery confirmation.',
      '16.2 Payout periods may be extended for risk/fraud prevention.'
    ]
  },
  {
    id: 17,
    title: 'Article 17 – Dispute Resolution',
    content: [
      '17.1 TradeMonk mediates disputes between Buyers and Sellers.',
      '17.3 Disputes must be opened within 7 days of delivery confirmation.',
      '17.6 TradeMonk decisions are based on available information.',
      '17.12 TradeMonk only has a mediating role and is not liable for damage.'
    ]
  },
  {
    id: 18,
    title: 'Article 18 – Intellectual Property Rights',
    content: [
      '18.1 All platform IP rights remain vested in TradeMonk.',
      '18.2 Content may not be copied or exploited without consent.'
    ]
  },
  {
    id: 19,
    title: 'Article 19 – Liability and Limitation Period',
    content: [
      '19.1 TradeMonk is not liable for Seller conduct, Buyer misuse, or carrier delays.',
      '19.6 Liability is limited to the amount paid by the insurer or specific transaction limits.'
    ]
  },
  {
    id: 20,
    title: 'Article 20 – Taxes and VAT',
    content: [
      '20.1 Sellers are solely responsible for income declaration and VAT compliance.'
    ]
  },
  {
    id: 21,
    title: 'Article 21 – Force Majeure',
    content: [
      'TradeMonk is not obliged to provide services in cases of force majeure (cybercrime, power outages, etc.).'
    ]
  },
  {
    id: 22,
    title: 'Article 22 – Customer Service',
    content: [
      '22.1 Users may contact support@trademonk.eu for questions or complaints.'
    ]
  },
  {
    id: 23,
    title: 'Article 23 – Suspension and Termination of the Agreement with the Seller',
    content: [
      '23.1 TradeMonk may suspend performance if Sellers fail to fulfill obligations.',
      '23.3 Agreements may be terminated for fraud, misuse, or repeated complaints.'
    ]
  },
  {
    id: 24,
    title: 'Article 24 – Personal Data',
    content: [
      'Personal data is processed in accordance with the GDPR and TradeMonk\'s Privacy Policy.'
    ]
  },
  {
    id: 25,
    title: 'Article 25 – Data',
    content: [
      '25.1 TradeMonk has access to Seller contact, business, and revenue data.',
      '25.3 Sellers must process Buyer data only in connection with Purchase Agreements and in accordance with the GDPR.'
    ]
  },
  {
    id: 26,
    title: 'Article 26 – Governing Law and Competent Court',
    content: [
      '26.1 Terms are governed by Dutch law.',
      '26.2 All disputes shall be submitted exclusively to the competent court in the Netherlands.'
    ]
  }
]

import { FileText, CheckCircle2 } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 bg-[#D4A017]/10 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={32} className="text-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Terms and Conditions</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold text-center">
            TradeMonk • Effective 11-03-2026
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-[#111C2E] border border-white/5 rounded-[32px] p-6 md:p-12 shadow-2xl space-y-12">
          {TOS_ARTICLES.map((article, index) => (
            <section key={article.id} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-4">
                <span className="text-[#D4A017] bg-[#D4A017]/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {article.title}
              </h2>
              <div className="space-y-3 pl-12">
                {article.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-white/70 text-sm md:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Footer Info */}
          <section className="space-y-4 text-xs text-muted-foreground pt-12 border-t border-white/5 text-center">
             <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-[#D4A017]" />
                <span className="font-bold uppercase tracking-widest">Official Policy</span>
             </div>
             <p>These Terms and Conditions entered into force on 11-3-2026. For questions regarding your account or terms of use, please contact TradeMonk support.</p>
          </section>
        </div>
        
        {/* Help Link */}
        <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
                Need more information? <a href="mailto:support@trademonk.eu" className="text-[#D4A017] hover:underline">Contact Support</a>
            </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
