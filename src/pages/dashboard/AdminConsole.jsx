import { Link } from 'react-router-dom'
import Heading from '../../components/ui/Heading.jsx'
import Text from '../../components/ui/Text.jsx'

function AdminConsole() {
  return (
    <div>
      <Heading level={1} size="md">
        Admin Console
      </Heading>
      <Text variant="body" className="mt-3 max-w-xl">
        Administrator-only tools for managing customers and accounts. This route is only reachable when signed
        in with an administrator role — regular customers are redirected away from it.
      </Text>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/dashboard/admin/customers"
          className="rounded-lg border border-text-secondary/15 bg-surface px-5 py-4 font-body text-sm font-medium text-primary hover:underline"
        >
          View all customers
        </Link>
        <Link
          to="/dashboard/admin/customers/add"
          className="rounded-lg border border-text-secondary/15 bg-surface px-5 py-4 font-body text-sm font-medium text-primary hover:underline"
        >
          Add a customer
        </Link>
      </div>
    </div>
  )
}

export default AdminConsole
