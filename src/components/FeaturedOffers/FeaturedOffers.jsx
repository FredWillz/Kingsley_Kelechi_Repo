import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import Button from '../ui/Button.jsx'
import Image from '../ui/Image.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'
import { offers } from './offersData.js'

function FeaturedOffers() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section
      ref={elementRef}
      aria-labelledby="featured-offers-heading"
      className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${revealClassName}`}
    >
      <Heading level={2} id="featured-offers-heading" className="sr-only">
        Featured offers
      </Heading>

      <div className="flex flex-col gap-16">
        {offers.map(({ image, title, description, fineprint, cta, to, imageSide }) => (
          <div key={title} className="grid items-center gap-8 lg:grid-cols-2">
            <div className={imageSide === 'left' ? 'lg:order-2' : 'lg:order-1'}>
              <Heading level={3} size="sm">
                {title}
              </Heading>
              <Text variant="body" className="mt-4 max-w-md">
                {description}
              </Text>
              {fineprint && (
                <Text variant="small" className="mt-3">
                  {fineprint}
                </Text>
              )}
              <Button to={to} className="mt-6 rounded-full">
                {cta}
              </Button>
            </div>
            <Image
              src={image.src}
              alt={image.alt}
              className={`aspect-4/3 w-full rounded-lg ${imageSide === 'left' ? 'lg:order-1' : 'lg:order-2'}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedOffers
