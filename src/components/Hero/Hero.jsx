import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import Button from '../ui/Button.jsx'
import Image from '../ui/Image.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'

function Hero() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section
      ref={elementRef}
      aria-labelledby="hero-heading"
      className={`flex flex-1 flex-col lg:grid lg:grid-cols-2 ${revealClassName}`}
    >
      <div className="flex shrink-0 flex-col justify-center px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <Heading level={1} id="hero-heading">
          Banking that moves at your pace.
        </Heading>
        <Text variant="lead" className="mt-4 max-w-xl">
          Open an account in minutes and manage everyday spending, saving, and transfers from one secure
          app.
        </Text>
        <div className="mt-8">
          <Button to="/open-account" size="lg">
            Open an account
          </Button>
        </div>
      </div>
      <div className="min-h-72 flex-1 sm:min-h-96 lg:h-auto lg:min-h-0">
        <Image
          src="/hero_background_image.avif"
          alt="Banking hero background"
          className="h-full w-full object-cover"
          lazy
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  )
}

export default Hero
