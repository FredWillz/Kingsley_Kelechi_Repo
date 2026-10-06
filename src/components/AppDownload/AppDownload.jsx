import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import Image from '../ui/Image.jsx'
import { AppStoreBadge, GooglePlayBadge } from './icons.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'

function AppDownload() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section ref={elementRef} aria-labelledby="app-download-heading" className={`bg-primary ${revealClassName}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="order-2 flex justify-center lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1764831138635-35873bdd671e?q=80&w=800&auto=format&fit=crop"
            alt="Person holding a smartphone displaying the Verxio Bank app"
            className="aspect-3/4 w-full max-w-xs rounded-2xl shadow-lg"
          />
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-left">
          <Heading level={2} id="app-download-heading" className="text-text-on-primary!">
            Bank from anywhere
          </Heading>
          <Text variant="lead" className="mx-auto mt-4 max-w-md text-text-on-primary/85! lg:mx-0">
            Check balances, move money, and manage cards in seconds with the HSBC mobile app.
          </Text>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownload
