import { Link } from 'react-router-dom'
import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import Image from '../ui/Image.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'
import { exploreItems } from './exploreData.js'
import { ChevronRightIcon } from '../HelpSupport/icons.jsx'

function ExploreMore() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section
      ref={elementRef}
      aria-labelledby="explore-more-heading"
      className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${revealClassName}`}
    >
      <Heading level={2} id="explore-more-heading">
        Explore more
      </Heading>
      <Text variant="lead" className="mt-3 max-w-2xl">
        Discover Premier banking, international services, and ways to grow your wealth with HSBC.
      </Text>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {exploreItems.map(({ image, title, description, to }) => (
          <li key={to} className="border border-text-secondary/15">
            <Link
              to={to}
              className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Image src={image.src} alt={image.alt} className="aspect-4/3 w-full" />
              <div className="flex flex-1 flex-col p-5">
                <Heading level={3} size="sm" className="inline-flex items-center gap-1 group-hover:text-primary">
                  {title}
                  <ChevronRightIcon className="mt-0.5" />
                </Heading>
                <Text variant="small" className="mt-2 flex-1">
                  {description}
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExploreMore
