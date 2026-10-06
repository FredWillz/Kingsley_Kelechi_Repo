import Heading from '../ui/Heading.jsx'
// import Text from '../ui/Text.jsx'
import { stats } from './statsData.js'
import useScrollReveal from '../../hooks/useScrollReveal.js'

function SocialProof() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section ref={elementRef} aria-labelledby="social-proof-heading" className={`bg-surface ${revealClassName}`}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Heading level={2} id="social-proof-heading" className="sr-only">
          Trusted by millions
        </Heading>

        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <dd className="font-heading text-4xl font-semibold text-primary">{value}</dd>
              <dt className="mt-2 font-body text-sm text-text-secondary">{label}</dt>
            </div>
          ))}
        </dl>

        {/* <blockquote className="mx-auto mt-14 max-w-2xl text-center">
          <Text as="p" variant="lead" className="text-text-primary">
            "Switching to Verxio took less than ten minutes, and I've never looked back."
          </Text>
          <cite className="mt-3 block font-body text-sm not-italic text-text-secondary">
            Amara O., Verxio customer since 2023
          </cite>
        </blockquote> */}
      </div>
    </section>
  )
}

export default SocialProof
