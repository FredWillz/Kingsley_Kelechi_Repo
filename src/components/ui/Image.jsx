/**
 * Optimized image component with lazy loading, responsive sizes, and format fallback
 */
function Image({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  sizes = '100vw',
  srcSet = null,
}) {
  const loading = lazy ? 'lazy' : 'eager'

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      srcSet={srcSet}
    />
  )
}

export default Image
