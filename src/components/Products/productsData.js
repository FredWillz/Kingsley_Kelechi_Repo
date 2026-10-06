import { WalletIcon, PiggyBankIcon, CardIcon, PercentIcon } from './icons.jsx'

export const products = [
  {
    icon: WalletIcon,
    title: 'Checking accounts',
    description: 'No monthly fees, fee-free overdraft cushion, and instant spending notifications.',
    to: '/personal/checking',
  },
  {
    icon: PiggyBankIcon,
    title: 'Savings accounts',
    description: 'Competitive interest, automated round-ups, and goal-based saving pots.',
    to: '/personal/savings',
  },
  {
    icon: CardIcon,
    title: 'Credit cards',
    description: 'Cashback on everyday spend with no annual fee on our starter card.',
    to: '/personal/cards',
  },
  {
    icon: PercentIcon,
    title: 'Personal loans',
    description: 'Fixed rates and flexible terms, with a decision in minutes.',
    to: '/personal/loans',
  },
]
