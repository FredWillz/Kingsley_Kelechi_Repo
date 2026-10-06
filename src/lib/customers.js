import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase.js'

export async function listCustomers() {
  const snapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'user')))
  const customers = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
  return customers.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}
