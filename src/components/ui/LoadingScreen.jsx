import Image from './Image.jsx'

function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 rounded-lg bg-surface">
      <Image src="/logo.webp" alt="Loading" className="h-12 w-auto animate-bounce" lazy={false} />
      <p className="font-body text-sm text-text-secondary">{label}</p>
    </div>
  )
}

export default LoadingScreen
