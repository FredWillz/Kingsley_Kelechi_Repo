import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase.js'

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? snapshot.data() : null
}

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data)
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data)
}
