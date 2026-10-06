import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase.js'

function beneficiariesRef(uid) {
  return collection(db, 'users', uid, 'beneficiaries')
}

export async function listBeneficiaries(uid) {
  const snapshot = await getDocs(beneficiariesRef(uid))
  const beneficiaries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return beneficiaries.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export async function addBeneficiary(uid, data) {
  await addDoc(beneficiariesRef(uid), { ...data, createdAt: serverTimestamp() })
}
