import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { firebaseConfig } from './firebase.js'
import { createUserProfile } from './userProfile.js'
import { createBackendUser } from './apiClient.js'

/**
 * Creates a new Firebase Auth user + Firestore profile without disturbing the
 * calling admin's own session. The Firebase client SDK signs in as whichever
 * user it just created, so this runs on a throwaway secondary app instance
 * instead of the app's main `auth`.
 *
 * Also sends the user data to the Node backend for additional processing/storage.
 */
export async function adminCreateUser({ email, password, profile }) {
  const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    const uid = credential.user.uid

    // Create Firestore profile
    await createUserProfile(uid, { email, ...profile })

    // Send user data to Node backend
    try {
      await createBackendUser({
        uid,
        email,
        profile,
      })
    } catch (backendError) {
      // Log the error but don't fail the user creation
      console.warn('Backend user creation failed (non-fatal):', backendError.message)
    }

    return uid
  } finally {
    await signOut(secondaryAuth)
    await deleteApp(secondaryApp)
  }
}
