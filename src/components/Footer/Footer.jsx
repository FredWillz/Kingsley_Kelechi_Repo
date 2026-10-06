import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";
import Text from "../ui/Text.jsx";
import { footerColumns } from "./footerLinks.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";

function Footer() {
  const year = new Date().getFullYear();
  const { elementRef, className: revealClassName } = useScrollReveal();

  return (
    <footer
      ref={elementRef}
      className={`border-t border-text-secondary/10 bg-surface ${revealClassName}`}
    >
      <div className="px-4 mx-auto max-w-7xl py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <Text variant="small" className="max-w-xs mt-4">
              Banking that moves at your pace. HSBC helps you spend, save, and
              grow with confidence.
            </Text>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-sm font-semibold font-heading text-text-primary">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors rounded-sm font-body text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-8 mt-12 border-t border-text-secondary/10 sm:flex-row sm:items-center sm:justify-between">
         
          <Text variant="small">
            © {year} HSBC Bank USA, N.A. 2026. All Rights Reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
