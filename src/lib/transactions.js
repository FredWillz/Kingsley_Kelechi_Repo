import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase.js'

function transactionsRef(uid) {
  return collection(db, 'users', uid, 'transactions')
}

/**
 * Reads the full ledger for one specific customer, including entries admins posted on
 * their behalf. Used for admin-facing views (e.g. the account statement) that need to
 * see everything. Customer-facing views should use listCustomerTransactions instead.
 */
export async function listTransactions(uid) {
  const snapshot = await getDocs(transactionsRef(uid))
  const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return transactions.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

/**
 * Reads the transaction history a customer should see: activity they carried out
 * themselves, excluding entries an admin posted to their account (credits/debits applied
 * from the admin panel), which show up in the admin statement instead.
 */
export async function listCustomerTransactions(uid) {
  const transactions = await listTransactions(uid)
  return transactions.filter((tx) => tx.source !== 'admin')
}

/**
 * Records a transaction for a customer. Call this wherever money actually moves so
 * listTransactions immediately reflects it. Pass source: 'admin' when an admin is
 * posting the entry on the customer's behalf, so it's excluded from their own
 * customer-facing transaction history.
 */
export async function addTransaction(
  uid,
  { description, amount, date, balance, status = 'successful', source = 'customer' },
) {
  await addDoc(transactionsRef(uid), {
    description,
    amount,
    date: date || new Date().toISOString().slice(0, 10),
    balance: balance ?? null,
    status,
    source,
    createdAt: serverTimestamp(),
  })
}

export async function deleteTransaction(uid, transactionId) {
  await deleteDoc(doc(db, 'users', uid, 'transactions', transactionId))
}
