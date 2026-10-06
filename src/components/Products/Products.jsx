import { Link } from 'react-router-dom'
import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'
import { products } from './productsData.js'
import useScrollReveal from '../../hooks/useScrollReveal.js'

function Products() {
  const { elementRef, className: revealClassName } = useScrollReveal()

  return (
    <section
      ref={elementRef}
      id="products"
      aria-labelledby="products-heading"
      className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${revealClassName}`}
    >
      <Heading level={2} id="products-heading" className="text-center">
        Everything you need, in one place
      </Heading>
      <Text variant="lead" className="mx-auto mt-3 max-w-2xl text-center">
        From everyday spending to long-term goals, explore the accounts built around how you actually
        bank.
      </Text>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(({ icon: Icon, title, description, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="group flex h-full flex-col rounded-lg border border-text-secondary/15 bg-background p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary">
                <Icon />
              </span>
              <Heading level={3} size="sm" className="mt-4">
                {title}
              </Heading>
              <Text variant="small" className="mt-2 flex-1">
                {description}
              </Text>
              <span className="mt-4 font-body text-sm font-semibold text-primary group-hover:underline">
                Learn more
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Products
