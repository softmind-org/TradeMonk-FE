/**
 * Professional Grading Section Component
 * Displays grading partners info
 */

const GradingSection = () => {
  const gradingPartners = ['PSA', 'BECKETT', 'CGC CARDS', 'SGC']

  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-foreground text-3xl md:text-4xl lg:text-5xl font-semibold italic mb-6">
          Professional Grading Standard
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12">
          We prioritize the integrity of your collection. Every transaction over $500 include complimentary identity and condition verification by our professional gradin associates.
        </p>
        
        {/* Grading Partners */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {gradingPartners.map((partner) => (
            <span 
              key={partner}
              className="text-muted-foreground text-xl md:text-2xl font-bold tracking-wide"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GradingSection
