import Heading from "../ui/Heading.jsx";
import Text from "../ui/Text.jsx";
import { trustSignals } from "./trustSignals.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";

function Trust() {
  const { elementRef, className: revealClassName } = useScrollReveal();

  return (
    <section
      ref={elementRef}
      aria-labelledby="trust-heading"
      className={`border-y border-text-secondary/10 bg-surface ${revealClassName}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Heading level={2} id="trust-heading" className="text-center">
          Your money, protected
        </Heading>
        <Text variant="lead" className="mx-auto mt-3 max-w-2xl text-center">
          Your money is protected by the same security, compliance, and
          regulatory standards trusted by the world's leading financial
          institutions.
        </Text>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-primary">
                <Icon />
              </span>
              <p className="mt-4 font-heading text-base font-semibold text-text-primary">
                {title}
              </p>
              <Text variant="small" className="mt-1">
                {description}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Trust;
