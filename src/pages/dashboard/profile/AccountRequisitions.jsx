import { useState } from 'react'
import Heading from '../../../components/ui/Heading.jsx'
import Text from '../../../components/ui/Text.jsx'
import Button from '../../../components/ui/Button.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import { GuideIcon } from '../../../components/Dashboard/icons.jsx'
import AccountStatementModal from '../../../components/AccountStatement/AccountStatementModal.jsx'

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 4.5A1.5 1.5 0 016.5 3H17a2 2 0 012 2v14a2 2 0 01-2 2H6.5A1.5 1.5 0 015 19.5v-15z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  )
}

function ChequebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 10h18M7 14h4" />
    </svg>
  )
}

function CardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19M6 14.5h4" />
    </svg>
  )
}

const requestTypes = [
  {
    icon: DocumentIcon,
    title: 'Account Statement',
    description: 'Request a certified statement for a date range you choose.',
  },
  {
    icon: ChequebookIcon,
    title: 'Chequebook',
    description: 'Order a new chequebook for delivery to your registered address.',
  },
  {
    icon: GuideIcon,
    title: 'Reference Letter',
    description: 'Request a bank reference or letter of introduction.',
  },
  {
    icon: CardIcon,
    title: 'Card Replacement',
    description: 'Request a replacement for a lost, stolen, or damaged card.',
  },
]

function AccountRequisitions() {
  const [statementModalOpen, setStatementModalOpen] = useState(false)

  return (
    <div>
      <Heading level={1} size="md">
        Account Requisitions
      </Heading>
      <Text variant="body" className="mt-2">
        Request statements, chequebooks, and other account documents.
      </Text>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {requestTypes.map((request) => (
          <div
            key={request.title}
            className="flex flex-col gap-3 rounded-lg border border-text-secondary/15 bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <request.icon />
              </span>
              {/* <span className="rounded-full bg-text-secondary/10 px-2.5 py-1 font-body text-xs font-medium text-text-secondary">
                Coming soon
              </span> */}
            </div>
            <div>
              <Heading level={3} size="sm">
                {request.title}
              </Heading>
              <Text variant="small" className="mt-1">
                {request.description}
              </Text>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => {
                if (request.title === 'Account Statement') {
                  setStatementModalOpen(true)
                }
              }}
              disabled={request.title !== 'Account Statement'}
            >
              Request
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Heading level={2} size="sm">
          Your requests
        </Heading>
        <div className="mt-4">
          <EmptyState
            icon={DocumentIcon}
            title="No requests yet"
            description="Once this feature is live, any statements, chequebooks, or other documents you request will show up here with their status."
          />
        </div>
      </div>

      <AccountStatementModal
        open={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
      />
    </div>
  )
}

export default AccountRequisitions
