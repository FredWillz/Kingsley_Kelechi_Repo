import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase.js'

export function normalizeUsername(username) {
  return username.trim().toLowerCase()
}

export async function getEmailForUsername(username) {
  const normalized = normalizeUsername(username)
  const snapshot = await getDoc(doc(db, 'usernames', normalized))
  return snapshot.exists() ? snapshot.data().email : null
}

export async function reserveUsername(username, uid, email) {
  const normalized = normalizeUsername(username)
  await setDoc(doc(db, 'usernames', normalized), { uid, email })
}

export async function renameUsername(oldUsername, newUsername, uid, email) {
  const oldNormalized = normalizeUsername(oldUsername)
  const newNormalized = normalizeUsername(newUsername)

  if (oldNormalized === newNormalized) return

  const existingMapping = await getDoc(doc(db, 'usernames', newNormalized))
  if (existingMapping.exists()) {
    throw new Error('Username already taken.')
  }

  await setDoc(doc(db, 'usernames', newNormalized), { uid, email })
  await deleteDoc(doc(db, 'usernames', oldNormalized))
}
