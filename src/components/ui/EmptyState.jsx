import Heading from './Heading.jsx'
import Text from './Text.jsx'
import Button from './Button.jsx'

function DefaultIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 4.5A1.5 1.5 0 016.5 3H17a2 2 0 012 2v14a2 2 0 01-2 2H6.5A1.5 1.5 0 015 19.5v-15z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  )
}

function EmptyState({ icon: Icon = DefaultIcon, title, description, actionLabel, actionTo }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-text-secondary/25 bg-surface px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon />
      </span>
      <Heading level={2} size="sm">
        {title}
      </Heading>
      {description && (
        <Text variant="small" className="max-w-sm">
          {description}
        </Text>
      )}
      {actionLabel && actionTo && (
        <Button to={actionTo} size="sm" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
