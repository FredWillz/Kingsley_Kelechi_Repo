import { getUserProfile, updateUserProfile } from './userProfile.js'
import { addTransaction, deleteTransaction, listTransactions } from './transactions.js'

async function applyLedgerEntry(uid, { type, amount, narration, date }) {
  const profile = await getUserProfile(uid)
  const currentBalance = Number(profile?.balance) || 0
  const signedAmount = type === 'credit' ? Math.abs(amount) : -Math.abs(amount)
  const nextBalance = currentBalance + signedAmount

  await addTransaction(uid, {
    description: narration,
    amount: signedAmount,
    date,
    balance: nextBalance,
    source: 'admin',
  })
  await updateUserProfile(uid, { balance: nextBalance })

  return nextBalance
}

export function creditCustomer(uid, entry) {
  return applyLedgerEntry(uid, { ...entry, type: 'credit' })
}

export function debitCustomer(uid, entry) {
  return applyLedgerEntry(uid, { ...entry, type: 'debit' })
}

/**
 * Statement entries in chronological order (oldest first), matching a bank statement
 * layout — the opposite order from listTransactions, which is most-recent-first for
 * the customer-facing activity feed.
 */
export async function listStatement(uid) {
  const entries = await listTransactions(uid)
  return [...entries].sort((a, b) => {
    const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
    const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
    if (aTime && bTime) return aTime - bTime
    return (a.date || '').localeCompare(b.date || '')
  })
}

/**
 * Removes a statement entry and reverses its effect on the customer's balance using
 * the entry's own signed amount, so credits and debits unwind symmetrically.
 */
export async function removeStatementEntry(uid, entry) {
  const profile = await getUserProfile(uid)
  const currentBalance = Number(profile?.balance) || 0
  const nextBalance = currentBalance - (Number(entry.amount) || 0)

  await deleteTransaction(uid, entry.id)
  await updateUserProfile(uid, { balance: nextBalance })

  return nextBalance
}
