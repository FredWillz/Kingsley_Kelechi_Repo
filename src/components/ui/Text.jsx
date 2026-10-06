const variants = {
  lead: 'text-lg text-text-secondary',
  body: 'text-base text-text-secondary',
  small: 'text-sm text-text-secondary',
}

function Text({ as: Tag = 'p', variant = 'body', className = '', children, ...props }) {
  return (
    <Tag className={`font-body ${variants[variant]} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}

export default Text
