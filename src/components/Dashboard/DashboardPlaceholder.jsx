import Heading from '../ui/Heading.jsx'
import Text from '../ui/Text.jsx'

function DashboardPlaceholder({ title, description }) {
  return (
    <div>
      <Heading level={1} size="md">
        {title}
      </Heading>
      <Text variant="body" className="mt-3 max-w-xl">
        {description}
      </Text>
    </div>
  )
}

export default DashboardPlaceholder
