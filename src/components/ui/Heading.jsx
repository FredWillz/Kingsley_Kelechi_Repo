const sizes = {
  xl: 'text-4xl md:text-5xl',
  lg: 'text-3xl md:text-4xl',
  md: 'text-2xl md:text-3xl',
  sm: 'text-xl',
}

const defaultSizeForLevel = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'sm',
  6: 'sm',
}

function Heading({ level = 2, size, className = '', children, ...props }) {
  const Tag = `h${level}`
  const visualSize = sizes[size] ? size : defaultSizeForLevel[level]

  return (
    <Tag
      className={`font-heading font-semibold text-text-primary ${sizes[visualSize]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Heading
