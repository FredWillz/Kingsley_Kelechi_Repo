import { Link } from 'react-router-dom'
import Image from './ui/Image.jsx'

function Logo({ className = 'h-8' }) {
  return (
    <Link to="/" className="inline-flex items-center">
      <Image
        src="/logo.webp"
        alt="Verxio Bank"
        className={`w-auto shrink-0 ${className}`.trim()}
        lazy={false}
      />
    </Link>
  )
}

export default Logo
