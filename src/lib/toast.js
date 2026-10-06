import { toast } from 'react-toastify'

const friendlyMessages = {
  'auth/network-request-failed': "We couldn't reach the server. Check your connection and try again.",
  'auth/invalid-login-credentials': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/email-already-in-use': 'That email is already registered to another account.',
  'auth/invalid-email': "That doesn't look like a valid email address.",
  'auth/weak-password': 'Please choose a stronger password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'permission-denied': "You don't have permission to do that.",
  unavailable: "We couldn't reach the server. Check your connection and try again.",
}

// Firebase's raw .message strings (e.g. "Firebase: Error (auth/invalid-credential).") are
// written for developers, not end users — there's no useful detail to salvage from them once
// the "(code)" part is stripped, so unmapped codes fall straight back to the caller's fallback
// instead of surfacing leftover boilerplate like a bare "Error".
export function notifyError(error, fallback = 'Something went wrong. Please try again.') {
  const code = error?.code
  const message = (code && friendlyMessages[code]) || fallback
  toast.error(message)
}

export function notifySuccess(message) {
  toast.success(message)
}
