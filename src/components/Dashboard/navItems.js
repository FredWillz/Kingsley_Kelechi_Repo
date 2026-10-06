import {
  GridIcon,
  ProfileIcon,
  HistoryIcon,
  GuideIcon,
  UserPlusIcon,
  UsersIcon,
  TransferIcon
} from './icons.jsx'

export const baseNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: GridIcon, end: true },
  { label: 'Transfer Funds', to: '/dashboard/transfer-funds', icon: TransferIcon },
  {
    label: 'Profile',
    to: '/dashboard/profile',
    icon: ProfileIcon,
    children: [
      { label: 'Account Requisitions', to: '/dashboard/profile/account-requisitions' },
      { label: 'Add Beneficiary', to: '/dashboard/profile/add-beneficiary' },
      { label: 'Change Password', to: '/dashboard/profile/change-password' },
    ],
  },
  { label: 'Transaction History', to: '/dashboard/transaction-history', icon: HistoryIcon },
  { label: 'User Guide', to: '/dashboard/user-guide', icon: GuideIcon },
]

export const adminNavItems = [
  // { label: 'Admin Console', to: '/dashboard/admin', icon: ShieldGearIcon },
  { label: 'All Customers', to: '/dashboard/admin/customers', icon: UsersIcon },
  { label: 'Add Customer', to: '/dashboard/admin/customers/add', icon: UserPlusIcon },
]
