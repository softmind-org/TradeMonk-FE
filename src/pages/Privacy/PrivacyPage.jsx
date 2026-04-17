const PRIVACY_ARTICLES = [
  {
    id: 1,
    title: 'Article 1. Data Controller and General Information',
    content: [
      '1.1. This privacy policy provides information about the personal data that TradeMonk processes from you as a user of the TradeMonk platform.',
      '1.2. The data controller is: TradeMonk, Keenkestraat 13, 6247 EJ Gronsveld, The Netherlands. Chamber of Commerce number: 99938561. Hereinafter referred to as “TradeMonk”.',
      'Contact details: Email: privacy@trademonk.eu. Phone: +31 6 81282661 (no customer support)',
      '1.3. TradeMonk considers the careful handling of personal data to be of great importance. TradeMonk processes your personal data in accordance with the General Data Protection Regulation (GDPR).',
      '1.4. TradeMonk processes your personal data for the following purposes: a. processing orders; b. creating an account; c. dispute resolution; d. sending newsletters; e. fraud prevention and security; f. promotional campaigns.'
    ]
  },
  {
    id: 2,
    title: 'Article 2. Order Processing',
    content: [
      '2.1. When you place an order, TradeMonk processes: first and last name, address details (address, postal code, city, country), email address, and payment details via Stripe. Providing this data is required to place an order.',
      '2.2. Legal basis: performance of a contract.',
      '2.3. Invoice data is processed due to a legal obligation.',
      '2.4. Data is used to process the order, send confirmation, allow shipping, process payment, and pay out sellers.',
      '2.5. Payments are processed via Stripe. TradeMonk does not store full credit card numbers or CVV codes.',
      '2.6. Data is retained for up to 7 years (tax obligations).'
    ]
  },
  {
    id: 3,
    title: 'Article 3. Account Creation',
    content: [
      '3.1. For private users: name, address, email, and login credentials.',
      '3.2. For professional sellers: company name, VAT number, business address, email, and bank details (via Stripe). Seller identity must be visible to buyers.',
      '3.3. Legal basis: performance of a contract.',
      '3.4. Data is used to create accounts, grant access, provide services, and handle disputes or complaints.',
      '3.5. Users can update data via their account.',
      '3.6. After account closure, all data is deleted.'
    ]
  },
  {
    id: 4,
    title: 'Article 4. Dispute Resolution',
    content: [
      '4.1. Data processed: name, address, email, photos/videos, bank details, and submitted messages.',
      '4.2. Purpose: handle complaints, verify shipment, and process refunds.',
      '4.3. Legal basis: contract performance.',
      '4.4. Retention: max. 5 years.'
    ]
  },
  {
    id: 5,
    title: 'Article 5. Newsletters',
    content: [
      '5.1. Only sent with consent.',
      '5.2. Data processed: email address.',
      '5.3. You can unsubscribe at any time via the link.'
    ]
  },
  {
    id: 6,
    title: 'Article 6. Promotional Campaigns',
    content: [
      '6.1. TradeMonk may use your listing for promotion.',
      '6.2. Only with consent.',
      '6.3. Data is deleted after withdrawal of consent.'
    ]
  },
  {
    id: 7,
    title: 'Article 7. Fraud Prevention and Security',
    content: [
      '7.1. Identity verification may be required (via Stripe).',
      '7.2. ID documents are processed by Stripe, not stored by TradeMonk.',
      '7.3. IP address is processed for server security and fraud prevention.',
      '7.5. Logs retained max. 30 days.',
      '7.6. Legal basis: legitimate interest.',
      '7.7. If required by law: legal obligation.'
    ]
  },
  {
    id: 8,
    title: 'Article 8. Consent',
    content: [
      'Consent can be withdrawn at any time. Withdrawal has no retroactive effect.'
    ]
  },
  {
    id: 9,
    title: 'Article 9. Third Parties and Data Sharing',
    content: [
      '9.1. TradeMonk uses third parties: accounting, IT providers (AWS), Stripe, and delivery services (PostNL, Sendcloud).',
      '9.2. Data may be processed outside the EEA with adequate protection.',
      '9.3. If needed, standard contractual clauses are used.',
      '9.4. Data may be shared if legally required or necessary for service delivery.',
      '9.5. TradeMonk never sells personal data.',
      '9.6. Stripe privacy policy: https://stripe.com/privacy'
    ]
  },
  {
    id: 10,
    title: 'Article 10. Data Security',
    content: [
      'TradeMonk applies: SSL encryption, encrypted login storage, secure cloud hosting (AWS), access control, role-based permissions, payout security, and fraud detection.'
    ]
  },
  {
    id: 11,
    title: 'Article 11. Right to Erasure',
    content: [
      '11.1. You may request deletion if data is no longer needed, you object, or data is incorrect.',
      '11.2. Exceptions apply where required by law.'
    ]
  },
  {
    id: 12,
    title: 'Article 12. Access, Portability and Correction',
    content: [
      '12.1. You can request access and a copy of your data.',
      '12.2. You can request corrections.'
    ]
  },
  {
    id: 13,
    title: 'Article 13. Right to Object',
    content: [
      'You may object to processing. TradeMonk will stop unless there are overriding legitimate grounds.'
    ]
  },
  {
    id: 14,
    title: 'Article 14. Restriction of Processing',
    content: [
      'You may request restriction while a request or objection is being handled.'
    ]
  },
  {
    id: 15,
    title: 'Article 15. Questions, Requests and Complaints',
    content: [
      '15.1. Contact TradeMonk for questions, exercising rights, or reporting misuse.',
      '15.2. TradeMonk may request verification.',
      '15.3. Response within 30 days.',
      '15.4. You may file a complaint with the Dutch Data Protection Authority.'
    ]
  },
  {
    id: 16,
    title: 'Article 16. Minors',
    content: [
      '16.1. Platform is not intended for users under 18.',
      '16.2. Data of minors will be deleted.'
    ]
  },
  {
    id: 17,
    title: 'Article 17. Changes',
    content: [
      'TradeMonk may update this policy. The latest version will be published on the platform.'
    ]
  },
  {
    id: 18,
    title: 'Article 18. Cookies',
    content: [
      'TradeMonk uses essential cookies. See the cookie policy: [link]'
    ]
  }
]

import { Shield, CheckCircle2 } from 'lucide-react'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6">
            <Shield size={32} className="text-[#10B981]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold text-center">
            TradeMonk • Data Protection & GDPR Compliance
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-[#111C2E] border border-white/5 rounded-[32px] p-6 md:p-12 shadow-2xl space-y-12">
          {PRIVACY_ARTICLES.map((article, index) => (
            <section key={article.id} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-4">
                <span className="text-[#10B981] bg-[#10B981]/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">
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
          <section className="space-y-4 text-xs text-muted-foreground pt-12 border-t border-white/5">
             <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-[#10B981]" />
                <span className="font-bold uppercase tracking-widest">Compliance Statement</span>
             </div>
             <p>This policy is strictly governed by the General Data Protection Regulation (GDPR) and Dutch privacy laws. TradeMonk is committed to protecting your personal information through industry-leading security practices.</p>
          </section>
        </div>
        
        {/* Help Link */}
        <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
                Have questions about your data? <a href="mailto:privacy@trademonk.eu" className="text-[#10B981] hover:underline">Contact Privacy Team</a>
            </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
