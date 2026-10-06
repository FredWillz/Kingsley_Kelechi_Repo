import Heading from '../../components/ui/Heading.jsx'
import Text from '../../components/ui/Text.jsx'
import {
  GridIcon,
  ProfileIcon,
  TransferIcon,
  ShieldGearIcon,
} from '../../components/Dashboard/icons.jsx'

const guideSections = [
  {
    icon: GridIcon,
    title: 'Getting started',
    items: [
      'Open an account online in minutes from the HSBC homepage.',
      'Sign in any time with the email and password you set when your account was created.',
      'Your dashboard shows your available balance, recent transactions, and quick actions in one place.',
    ],
  },
  {
    icon: ProfileIcon,
    title: 'Managing your profile',
    items: [
      'View and review your personal and account details under Profile.',
      'Request statements and other account documents under Account Requisitions.',
      'Change your password any time under Change Password, we recommend doing this periodically.',
    ],
  },
  {
    icon: TransferIcon,
    title: 'Transfers & beneficiaries',
    items: [
      'Add a beneficiary before sending them money, save their details once, reuse them every time.',
      'Transfer funds between your own accounts or to a saved beneficiary from Transfer Funds.',
      'Review everything that has moved through your account under Transaction History.',
    ],
  },
  {
    icon: ShieldGearIcon,
    title: 'Security & safety',
    items: [
      'HSBC will never ask you to move money to "keep it safe", treat any such request as a scam.',
      'Use a strong, unique password for your account and update it if you ever suspect it was exposed.',
      'Contact support immediately if you notice a transaction you don’t recognize.',
    ],
  },
]

function UserGuide() {
  return (
    <div>
      <Heading level={1} size="md">
        User Guide
      </Heading>
      <Text variant="body" className="max-w-2xl mt-2">
        Everything you need to know to get the most out of your account, organized by what you're
        trying to do.
      </Text>

      <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
        {guideSections.map((section) => (
          <div key={section.title} className="p-6 border rounded-lg border-text-secondary/15 bg-surface">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-primary/10 text-primary">
                <section.icon className="w-5 h-5" />
              </span>
              <Heading level={2} size="sm">
                {section.title}
              </Heading>
            </div>
            <ul className="flex flex-col gap-3 mt-4">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2.5 font-body text-sm text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-6 mt-8 border rounded-lg border-text-secondary/15 bg-surface">
        <Heading level={2} size="sm">
          Need more help?
        </Heading>
        <Text variant="body">
          Can't find what you're looking for? Reach our support team at{' '}
          <a href="mailto:support@hsbquartersinfo.com" className="font-medium text-primary hover:underline">
            support@hsbc.com
          </a>
          .
        </Text>
      </div>
    </div>
  )
}

export default UserGuide
